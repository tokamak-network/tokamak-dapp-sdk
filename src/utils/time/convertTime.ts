import { BigNumber } from "ethers";

export const convertTimeFromBN = (time: BigNumber): number => {
  return time.toNumber();
};
