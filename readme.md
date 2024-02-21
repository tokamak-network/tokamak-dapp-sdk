# ProjectManager

The `ProjectManager` class is a comprehensive class that provides various functionalities needed for managing a project. This class is responsible for managing the state of the project, handling user information, managing token information, and more.

## How to use

```
import {ProjectManager} from "tokamak-dapp-sdk/tonstarter"

const projeceManager = new ProjectManager({
    chainId: 5050,
    l2Token: "0xAf3966fC0C5a1Ef8d29d69E3E6Ef0B9C74dE5f84",
    account: "0xAA5a562B2C3CA302aFa35db0b94738A7384d6aA3"
})

//Fetch datas from the contracts
await projectManager.syncData();

/**
 * You can use these data structures as interfaces for your project.
 * Refer to the "Member Variables" section below for descriptions of each member variable.
 */

projectManager.projectInfo;
projectManager.manageInfo;
projectManager.saleInfo;
projectManager.timeInfo;
projectManager.claimInfo;
projectManager.userInfo;
projectManager.tokenInfo;
projectManager.status;
projectManager.isSet;

```

## Member Variables

The `ProjectManager` class has the following member variables:

- `chainId`: A number representing the chain ID **1, 5, 5050, and 55004**.
- `l2Token`: A string representing the Layer 2 token, which was created by [TONStarter](https://github.com/tokamak-network/TONStarter-sdk).
- `account`: A string representing the user's account.
- `L2ProjectManagerProxy`: A Contract object for interacting with the Layer 2 Project Manager.
- `SaleVaultProxy`: A Contract object for interacting with the Sale Vault.
- `provider`: An `ethers.Provider` object for interacting with the network.
- `cache`: A Map object for caching data.

- `ProjectInfo`: Represents information about a project, including `name`, `owner`, `l1Token`, and `l2Token`.

- `ManageInfo`: Holds details about managing the project, including `set1rdTokenAmount`, `set2rdTokenAmount`, `saleTokenPrice`, `tonPrice`, `hardCap`, `changeTOS`, `remainTON`, `changeTick`, `exchangeTOS`, and `adminWithdraw`.

- `SaleInfo`: Stores information about the project's sale, including `total1rdSaleAmount`, `total1rdTONAmount`, `totalUsers`, `total1rdUsers`, `total2rdUsers`, and `total2rdUsersClaim`.

- `TimeInfo`: Contains various time-related information for the project, such as `deployTime`, `snapshot`, `whiteListStartTime`, `whiteListEndTime`, `round1StartTime`, `round1EndTime`, `round2StartTime`, and `round2EndTime`.

- `ClaimInfo`: Contains information about claiming tokens, including `totalClaimCounts`, `firstClaimPercent`, `firstClaimTime`, `secondClaimTime`, and `claimInterval`.

- `UserInfo` : Contains information about the user, which is obtained from the `l2Token` variable when it is initialized. It's including `tier` and `isWhitelisted`.

- `TokenInfo`: Contains information about the project's token, including `tokenName`, `tokenSymbol`, and `tokenTotalSupply`.

- `Status`: Stores the current status of the project, including `currentStep`, `currentStepEndDate`, `nextStep`, and `nextStepDate`.

- `isSet`: A boolean indicating whether the project has been set or not.
