import { ProjectManager } from "../dist/__commonjs/tonstarter";
// import { ProjectManager } from "../src/tonstarter";

const test = async () => {
  console.log("**test started**");
  const projectManager = new ProjectManager({
    chainId: 5050,
    l2Token: "0xAf3966fC0C5a1Ef8d29d69E3E6Ef0B9C74dE5f84",
    account: "0xAA5a562B2C3CA302aFa35db0b94738A7384d6aA3",
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
};

test();
