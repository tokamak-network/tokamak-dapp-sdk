import { ClaimInfo, ManageInfo, SaleInfo, TimeInfo } from "types/tonstarter";
import { convertTimeFromBN } from "utils/time";

export const filterContractData = (params: {
  timeInfoData: any;
  saleInfoData: any;
  manageInfoData: any;
  claimInfoData: any;
}) => {
  const { timeInfoData, saleInfoData, manageInfoData, claimInfoData } = params;
  const timeInfo: TimeInfo = {
    deployTime: convertTimeFromBN(timeInfoData.deployTime),
    snapshot: convertTimeFromBN(timeInfoData.snapshot),
    whiteListStartTime: convertTimeFromBN(timeInfoData.whiteListStartTime),
    whiteListEndTime: convertTimeFromBN(timeInfoData.whiteListEndTime),
    round1StartTime: convertTimeFromBN(timeInfoData.round1StartTime),
    round1EndTime: convertTimeFromBN(timeInfoData.round1EndTime),
    round2StartTime: convertTimeFromBN(timeInfoData.round2StartTime),
    round2EndTime: convertTimeFromBN(timeInfoData.round2EndTime),
  };
  const saleInfo: SaleInfo = {
    total1rdSaleAmount: convertTimeFromBN(saleInfoData.total1rdSaleAmount),
    total1rdTONAmount: convertTimeFromBN(saleInfoData.total1rdTONAmount),
    totalUsers: convertTimeFromBN(saleInfoData.totalUsers),
    total1rdUsers: convertTimeFromBN(saleInfoData.total1rdUsers),
    total2rdUsers: convertTimeFromBN(saleInfoData.total2rdUsers),
    total2rdUsersClaim: convertTimeFromBN(saleInfoData.total2rdUsersClaim),
  };
  const manageInfo: ManageInfo = {
    set1rdTokenAmount: convertTimeFromBN(manageInfoData.set1rdTokenAmount),
    set2rdTokenAmount: convertTimeFromBN(manageInfoData.set2rdTokenAmount),
    saleTokenPrice: convertTimeFromBN(manageInfoData.saleTokenPrice),
    tonPrice: convertTimeFromBN(manageInfoData.tonPrice),
    hardCap: convertTimeFromBN(manageInfoData.hardCap),
    changeTOS: convertTimeFromBN(manageInfoData.changeTOS),
    remainTON: convertTimeFromBN(manageInfoData.remainTON),
    changeTick: manageInfoData.changeTick,
    exchangeTOS: manageInfoData.exchangeTOS,
    adminWithdraw: manageInfoData.adminWithdraw,
  };
  const claimInfo: ClaimInfo = {
    totalClaimCounts: convertTimeFromBN(claimInfoData.totalClaimCounts),
    firstClaimPercent: convertTimeFromBN(claimInfoData.firstClaimPercent),
    firstClaimTime: convertTimeFromBN(claimInfoData.firstClaimTime),
    secondClaimTime: convertTimeFromBN(claimInfoData.secondClaimTime),
    claimInterval: convertTimeFromBN(claimInfoData.claimInterval),
  };

  return {
    timeInfo,
    saleInfo,
    manageInfo,
    claimInfo,
  };
};
