import { ethers, BigNumber } from "ethers";

export const parseUnit = (unit: BigNumber | string) => {
  const valueInDecimal = ethers.utils.formatEther(unit);
  return Number(valueInDecimal);
};
