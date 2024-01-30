import {
  ClaimInfo,
  I_ProjectManager,
  ManageInfo,
  ProjectInfo,
  SaleInfo,
  Status,
  TimeInfo,
} from "types/tonstarter";
import { MultiChainSDK } from "tokamak-multichain";
import { Contract } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";
import SaleVaultProxyABI from "../constants/abis/L2PublicSaleVaultProxy.json";
import { filterContractData } from "./utils/filterContractData";
import { getStatus } from "./utils/schedule";

export class ProjectManager implements I_ProjectManager {
  chainId: number;
  l2Token: string;
  L2ProjectManagerProxy: Contract;
  SaleVaultProxy: Contract | undefined;
  provider: Provider;

  cache: Map<string, any>;
  projectInfo: ProjectInfo | undefined;
  timeInfo: TimeInfo | undefined;
  saleInfo: SaleInfo | undefined;
  manageInfo: ManageInfo | undefined;
  claimInfo: ClaimInfo | undefined;
  status: Status | undefined;
  isSet: boolean;

  constructor(opts: { chainId: number; l2Token: string; provider?: Provider }) {
    this.chainId = opts.chainId;
    this.l2Token = opts.l2Token;
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
      this.setIsSet(this.status !== undefined);
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
      const projectInfo = {
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
        SaleVaultProxyABI,
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
    }
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
