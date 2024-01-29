import { Provider } from "@ethersproject/abstract-provider";
import { Contract } from "ethers";

export interface I_ProjectManager {
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
}

export type ProjectInfo = {
  name: string;
  owner: string;
  l1Token: string;
  l2Token: string;
};

export type TimeInfo = {
  deployTime: number;
  snapshot: number;
  whiteListStartTime: number;
  whiteListEndTime: number;
  round1StartTime: number;
  round1EndTime: number;
  round2StartTime: number;
  round2EndTime: number;
};

export type SaleInfo = {
  total1rdSaleAmount: number;
  total1rdTONAmount: number;
  totalUsers: number;
  total1rdUsers: number;
  total2rdUsers: number;
  total2rdUsersClaim: number;
};

export type ManageInfo = {
  set1rdTokenAmount: number;
  set2rdTokenAmount: number;
  saleTokenPrice: number;
  tonPrice: number;
  hardCap: number;
  changeTOS: number;
  remainTON: number;
  changeTick: number;
  exchangeTOS: boolean;
  adminWithdraw: boolean;
};

export type ClaimInfo = {
  totalClaimCounts: number;
  firstClaimPercent: number;
  firstClaimTime: number;
  secondClaimTime: number;
  claimInterval: number;
};

export type Status = {
  currentStep: "snapshot" | "whitelist" | "round1" | "round2" | "claim";
  currentStepEndDate: number;
  nextStep: "whitelist" | "round1" | "round2" | "claim";
  nextStepDate: number;
};
