import { ClaimInfo, ManageInfo, SaleInfo, TimeInfo } from "types/tonstarter";
import { convertTimeFromBN } from "utils/time";
import { parseUnit } from "utils/contract";

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
    total1rdSaleAmount: parseUnit(saleInfoData.total1rdSaleAmount),
    total1rdTONAmount: parseUnit(saleInfoData.total1rdTONAmount),
    totalUsers: parseUnit(saleInfoData.totalUsers),
    total1rdUsers: parseUnit(saleInfoData.total1rdUsers),
    total2rdUsers: parseUnit(saleInfoData.total2rdUsers),
    total2rdUsersClaim: parseUnit(saleInfoData.total2rdUsersClaim),
  };
  const manageInfo: ManageInfo = {
    set1rdTokenAmount: parseUnit(manageInfoData.set1rdTokenAmount),
    set2rdTokenAmount: parseUnit(manageInfoData.set2rdTokenAmount),
    saleTokenPrice: parseUnit(manageInfoData.saleTokenPrice),
    tonPrice: parseUnit(manageInfoData.tonPrice),
    hardCap: parseUnit(manageInfoData.hardCap),
    changeTOS: Number(manageInfoData.changeTOS.toString()),
    remainTON: parseUnit(manageInfoData.remainTON),
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
