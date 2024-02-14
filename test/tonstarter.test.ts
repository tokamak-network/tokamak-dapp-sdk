import { ProjectManager } from "tonstarter";

const test = async () => {
  console.log("**test started**");
  const projectManager = new ProjectManager({
    chainId: 5050,
    l2Token: "0xc1c838f11a4f8420245f278c3c2592f0798111ec",
  });
  await projectManager.syncData();
  console.log(projectManager.projectInfo);
  console.log(projectManager.manageInfo);
  console.log(projectManager.saleInfo);
  console.log(projectManager.claimInfo);
  console.log(projectManager.status);
  console.log(projectManager.isSet);
};
test();
