import { ClaimInfo, Status, TimeInfo } from "types/tonstarter";
import { getCurrentTime } from "utils/time";

export const getStatus = (
  timeInfo: TimeInfo,
  claimInfo: ClaimInfo,
): Status | undefined => {
  const nowTime = getCurrentTime();

  for (const [key, value] of Object.entries(timeInfo)) {
    if (key === "deployTime") continue;
    if (nowTime <= value) {
      const currentStep = key.includes("snap")
        ? "snapshot"
        : key.includes("white")
          ? "whitelist"
          : key.includes("round1")
            ? "round1"
            : key === "round2StartTime"
              ? "round2"
              : "claim";
      const currentStepEndDate =
        currentStep === "snapshot"
          ? timeInfo.snapshot
          : currentStep === "whitelist"
            ? timeInfo.whiteListEndTime
            : currentStep === "round1"
              ? timeInfo.round1EndTime
              : currentStep === "round2"
                ? timeInfo.round2EndTime
                : claimInfo.firstClaimTime;
      const nextStep =
        currentStep === "snapshot"
          ? "whitelist"
          : currentStep === "whitelist"
            ? "round1"
            : currentStep === "round1"
              ? "round2"
              : "claim";
      const nextStepDate =
        nextStep === "whitelist"
          ? timeInfo.whiteListStartTime
          : nextStep === "round1"
            ? timeInfo.round1StartTime
            : timeInfo.round2StartTime;

      return {
        currentStep,
        currentStepEndDate,
        nextStep,
        nextStepDate,
      };
    }
  }
  return undefined;
};
