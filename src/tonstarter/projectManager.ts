import {
  ClaimInfo,
  I_ProjectManager,
  ManageInfo,
  ProjectInfo,
  SaleInfo,
  Status,
  TimeInfo,
  UserInfo,
} from "types/tonstarter";
import { MultiChainSDK } from "tokamak-multichain";
import { Contract } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import SaleVaultProxyABI from "../constants/abis/L2PublicSaleVaultProxy.json";
import { filterContractData } from "./utils/filterContractData";
import { getStatus } from "./utils/schedule";
import { formatEther, parseEther } from "ethers/lib/utils";

export class ProjectManager implements I_ProjectManager {
  chainId: number;
  l2Token: string;
  account: string | undefined;
  L2ProjectManagerProxy: Contract;
  SaleVaultProxy: Contract | undefined;
  provider: Provider;

  cache: Map<string, any>;
  projectInfo: ProjectInfo | undefined;
  timeInfo: TimeInfo | undefined;
  saleInfo: SaleInfo | undefined;
  manageInfo: ManageInfo | undefined;
  claimInfo: ClaimInfo | undefined;
  userInfo: UserInfo;
  status: Status | undefined;
  isSet: boolean;

  get test(): ClaimInfo {
    return this.claimInfo as ClaimInfo;
  }

  constructor(opts: {
    chainId: number;
    l2Token: string;
    account?: string;
    provider?: Provider;
  }) {
    this.chainId = opts.chainId;
    this.l2Token = opts.l2Token;
    this.account = opts.account;
    this.cache = new Map<string, any>();

    const TokamakChainSDK = new MultiChainSDK({ chainId: opts.chainId });
    this.L2ProjectManagerProxy = TokamakChainSDK.getContract(
      "L2ProjectManagerProxy",
    );
    this.provider = opts.provider ?? TokamakChainSDK.provider;
    this.isSet = false;
  }

  public async syncData() {
    try {
      await Promise.all([this.fetchProjectInfo(), this.fetchSaleInfo()]);
      await this.fetchStatus();
      await this.fetchUserInfo();
    } catch (e) {
      this.setIsSet(false);
      throw new Error("**Error happened while syncing datas**");
    }
  }

  private async fetchProjectInfo() {
    const projectInfoData = await this.L2ProjectManagerProxy.projects(
      this.l2Token,
    );
    if (projectInfoData) {
      const projectInfo: ProjectInfo = {
        name: projectInfoData.projectName,
        owner: projectInfoData.projectOwner,
        l1Token: projectInfoData.l1Token,
        l2Token: projectInfoData.l2Token,
      };
      this.setProjectInfo(projectInfo);
    }
  }

  private async fetchSaleInfo() {
    if (!this.SaleVaultProxy) {
      const publicSaleVaultProxyAddress =
        await this.L2ProjectManagerProxy.publicSaleVault();
      this.SaleVaultProxy = new Contract(
        publicSaleVaultProxyAddress,
        SaleVaultProxyABI.abi,
        this.provider,
      );
    }
    const [timeInfoData, saleInfoData, manageInfoData, claimInfoData] =
      await Promise.all([
        this.SaleVaultProxy.timeInfo(this.l2Token),
        this.SaleVaultProxy.saleInfo(this.l2Token),
        this.SaleVaultProxy.manageInfo(this.l2Token),
        this.SaleVaultProxy.claimInfo(this.l2Token),
      ]);
    const { timeInfo, saleInfo, manageInfo, claimInfo } = filterContractData({
      timeInfoData,
      saleInfoData,
      manageInfoData,
      claimInfoData,
    });
    this.setTimeInfo(timeInfo);
    this.setSaleInfo(saleInfo);
    this.setManageInfo(manageInfo);
    this.setClaimInfo(claimInfo);
  }

  private async fetchStatus() {
    if (this.timeInfo && this.claimInfo) {
      const status = getStatus(this.timeInfo, this.claimInfo);
      if (status) this.setStatus(status);
      this.setIsSet(status !== undefined);
    }
  }

  /**
   * notion : https://www.notion.so/onther/clean-up-Front-function-2762cf202bd3416b971053c0fd82278f
   */
  public async fetchUserInfo() {
    if (!this.account || !this.SaleVaultProxy || !this.status) return;
    switch (this.status.currentStep) {
      case "snapshot":
        return this.setUserInfo(undefined);
      default:
        const [tier, round1Info, round2Info, claimableAmount] =
          await Promise.all([
            this.SaleVaultProxy.calculTier(this.l2Token, this.account),
            this.SaleVaultProxy.user1rd(this.l2Token, this.account),
            this.SaleVaultProxy.user2rd(this.l2Token, this.account),
            this.SaleVaultProxy.calculClaimAmount(
              this.l2Token,
              this.account,
              0,
            ),
          ]);

        const userInfoRound1 = {
          paidRound1: Number(formatEther(round1Info.payAmount)),
          purchasedRound1: Number(formatEther(round1Info.saleAmount)),
        };

        const userInfoRound2 = {
          paidRound2: Number(formatEther(round2Info.depositAmount)),
        };

        const claimInfo = {
          claimableAmount: Number(formatEther(claimableAmount)),
        };

        return this.setUserInfo({
          tier: Number(tier.toString()),
          isWhitelisted: round1Info.join,
          ...userInfoRound1,
          ...userInfoRound2,
          ...claimInfo,
        });
    }
  }

  public async participate(amount: number) {
    if (!this.account || !this.SaleVaultProxy || !this.status) return;
    switch (this.status.currentStep) {
      case "whitelist":
        return this.SaleVaultProxy.connect(this.provider).addWhiteList(
          this.l2Token,
        );
      case "round1":
        return this.SaleVaultProxy.connect(this.provider).round1Sale(
          this.l2Token,
          parseEther(amount.toString()),
        );
      case "round2":
        return this.SaleVaultProxy.connect(this.provider).round2Sale(
          this.l2Token,
          parseEther(amount.toString()),
        );
      case "whitelist":
        return this.SaleVaultProxy.connect(this.provider).calculClaimAmount(
          this.l2Token,
          this.account,
          0,
        );
    }
  }

  private setUserInfo(userInfo: UserInfo) {
    this.userInfo = userInfo;
  }

  private setProjectInfo(projectInfo: ProjectInfo) {
    this.projectInfo = projectInfo;
  }
  private setTimeInfo(timeInfo: TimeInfo) {
    this.timeInfo = timeInfo;
  }
  private setSaleInfo(saleInfo: SaleInfo) {
    this.saleInfo = saleInfo;
  }
  private setManageInfo(manageInfo: ManageInfo) {
    this.manageInfo = manageInfo;
  }
  private setClaimInfo(claimInfo: ClaimInfo) {
    this.claimInfo = claimInfo;
  }
  private setStatus(status: Status) {
    this.status = status;
  }
  private setIsSet(isSet: boolean) {
    this.isSet = isSet;
  }
}
