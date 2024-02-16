// import { ProjectManager } from "../dist/__commonjs/tonstarter";
import { ProjectManager } from "../src/tonstarter";

const test = async () => {
  console.log("**test started**");
  const projectManager = new ProjectManager({
    chainId: 5050,
    l2Token: "0xc1c838f11a4f8420245f278c3c2592f0798111ec",
    account: "0x8c595DA827F4182bC0E3917BccA8e654DF8223E1",
  });
  await projectManager.syncData();
  console.log(projectManager.projectInfo);
  console.log(projectManager.manageInfo);
  console.log(projectManager.saleInfo);
  console.log(projectManager.claimInfo);
  console.log(projectManager.userInfo);
  console.log(projectManager.status);
  console.log(projectManager.isSet);
};
test();
