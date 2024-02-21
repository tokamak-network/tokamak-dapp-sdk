import {
  ClaimInfo,
  I_ProjectManager,
  ManageInfo,
  ProjectInfo,
  SaleInfo,
  Status,
  TimeInfo,
  UserInfo,
  TokenInfo,
} from "types/tonstarter";
import { MultiChainSDK } from "tokamak-multichain";
import { Contract } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import SaleVaultProxyABI from "../constants/abis/L2PublicSaleVaultProxy.json";
import ERC20ABI from "../constants/abis/ERC20.json";
import { filterContractData } from "./utils/filterContractData";
import { getStatus } from "./utils/schedule";
import { formatEther, parseEther } from "ethers/lib/utils";

export class ProjectManager implements I_ProjectManager {
  /** A number representing the ID of the blockchain chain. */
  chainId: number;

  /** A string representing the Layer 2 token. */
  l2Token: string;

  /** A string representing the user's account. */
  account: string | undefined;

  /** A Contract object for interacting with the Layer 2 Project Manager smart contract. */
  L2ProjectManagerProxy: Contract;

  /** A Contract object for interacting with the Sale Vault smart contract. */
  SaleVaultProxy: Contract | undefined;

  /** A Contract object for interacting with the Sale Vault smart contract. */
  TokenContract: Contract;

  /** A Provider object for interacting with the Ethereum network. */
  provider: Provider;

  /** A Map object for caching data. */
  cache: Map<string, any>;

  /** A ProjectInfo object containing information about the project. */
  projectInfo: ProjectInfo | undefined;

  /** A TimeInfo object containing time-related information. */
  timeInfo: TimeInfo | undefined;

  /** A SaleInfo object containing information about the sale. */
  saleInfo: SaleInfo | undefined;

  /** A ManageInfo object containing management-related information. */
  manageInfo: ManageInfo | undefined;

  /** A ClaimInfo object containing information about claims. */
  claimInfo: ClaimInfo | undefined;

  /** A UserInfo object, containing information about the user. */
  userInfo: UserInfo;

  /** A TokenInfo object containing information about the token. */
  tokenInfo: TokenInfo | undefined;

  /** A Status object representing the status of the project. */
  status: Status | undefined;

  /** A boolean indicating whether the project has been set or not. */
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
    this.TokenContract = new Contract(
      this.l2Token,
      ERC20ABI.abi,
      this.provider,
    );
    this.isSet = false;
  }

  public async syncData() {
    try {
      await Promise.all([
        this.fetchProjectInfo(),
        this.fetchSaleInfo(),
        this.fetchTokenInfo(),
      ]);
      await this.fetchStatus();
      await this.fetchUserInfo();
    } catch (e) {
      this.setIsSet(false);
      console.log(e);
      throw new Error("**Error happened while syncing datas**");
    }
  }

  private async fetchTokenInfo() {
    const [name, symbol, totalSupply] = await Promise.all([
      this.TokenContract.name(),
      this.TokenContract.symbol(),
      this.TokenContract.totalSupply(),
    ]);
    this.setTokenInfo({
      tokenName: name,
      tokenSymbol: symbol,
      totalSupply: Number(formatEther(totalSupply)),
    });
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
              1,
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

        console.log();

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
  private setTokenInfo(tokenInfo: TokenInfo) {
    this.tokenInfo = tokenInfo;
  }
  private setStatus(status: Status) {
    this.status = status;
  }
  private setIsSet(isSet: boolean) {
    this.isSet = isSet;
  }
}
