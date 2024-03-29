import { Provider } from "@ethersproject/abstract-provider";
import { Contract } from "ethers";

export interface I_ProjectManager {
  chainId: number;
  l2Token: string;
  L2ProjectManagerProxy: Contract;
  SaleVaultProxy?: Contract;
  TokenContract: Contract;
  provider: Provider;

  cache: Map<string, any>;
  projectInfo?: ProjectInfo;
  timeInfo?: TimeInfo;
  saleInfo?: SaleInfo;
  manageInfo?: ManageInfo;
  claimInfo?: ClaimInfo;
  tokenInfo?: TokenInfo;
  tierInfo?: TierInfo;
  vaultInfo?: VaultInfo;
  status?: Status;
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

export type UserInfo_whitelist = {
  tier: number;
  isWhitelisted: boolean;
};

export type UserInfo_round1 = {
  paidRound1: number;
  purchasedRound1: number;
};

export type UserInfo_round2 = {
  paidRound2: number;
};

export type UserInfo_claim = {
  claimableAmount: number;
};

export type UserInfo =
  | (UserInfo_whitelist & UserInfo_round1 & UserInfo_round2 & UserInfo_claim)
  | undefined;

export type Status = {
  currentStep: "snapshot" | "whitelist" | "round1" | "round2" | "claim";
  currentStepEndDate: number;
  nextStep: "whitelist" | "round1" | "round2" | "claim";
  nextStepDate: number;
};

export type TokenInfo = {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: number;
};

export type TierInfo = {
  1: {
    percent: number;
    amount: number;
  };
  2: {
    percent: number;
    amount: number;
  };
  3: {
    percent: number;
    amount: number;
  };
  4: {
    percent: number;
    amount: number;
  };
};

export type Vault = {
  allocatedAmount: number;
};

export type VaultInfo = {
  Sale: Vault;
  Liquidity: Vault;
  Ecosystem: Vault;
  Team: Vault;
  TONStarter: Vault;
};
