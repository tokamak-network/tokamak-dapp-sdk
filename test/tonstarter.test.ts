// import { ProjectManager } from "../dist/__commonjs/tonstarter";
import { ProjectManager } from "../src/tonstarter";

const test = async () => {
  console.log("**test started**");
  const projectManager = new ProjectManager({
    chainId: 5050,
    l2Token: "0xd5453568dd56c81af8529e6ae4d9103d966dc2e3",
    account: "0x8c595DA827F4182bC0E3917BccA8e654DF8223E1",
  });

  await projectManager.syncData();

  console.log(projectManager.projectInfo);
  console.log(projectManager.manageInfo);
  console.log(projectManager.saleInfo);
  console.log(projectManager.timeInfo);
  console.log(projectManager.claimInfo);

  console.log(projectManager.userInfo);
  console.log(projectManager.status);
  console.log(projectManager.isSet);
  console.log(projectManager.tokenInfo);
  console.log(projectManager.tierInfo);
  console.log(projectManager.userInfo);
};

test();
