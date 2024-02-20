// import { ProjectManager } from "../dist/__commonjs/tonstarter";
import { ProjectManager } from "../src/tonstarter";

const test = async () => {
  console.log("**test started**");
  const projectManager = new ProjectManager({
    chainId: 5050,
    l2Token: "0x1afecef37535250824741d60a97f240c495c06f5",
    account: "0xAA5a562B2C3CA302aFa35db0b94738A7384d6aA3",
  });
  await projectManager.syncData();
  console.log(projectManager.projectInfo);
  console.log(projectManager.manageInfo);
  console.log(projectManager.saleInfo);
  console.log(projectManager.claimInfo);
  console.log(projectManager.userInfo);
  console.log(projectManager.status);
  console.log(projectManager.isSet);
  console.log(projectManager.tokenInfo);
};
test();
