# ProjectManager

The `ProjectManager` class is a comprehensive class that provides various functionalities needed for managing a project. This class is responsible for managing the state of the project, handling user information, managing token information, and more.

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

- `TimeInfo`: Contains various time-related information for the project, such as `deployTime`, `snapshot`, `whiteListStartTime`, `whiteListEndTime`, `round1StartTime`, `round1EndTime`, `round2StartTime`, and `round2EndTime`.

- `SaleInfo`: Stores information about the project's sale, including `total1rdSaleAmount`, `total1rdTONAmount`, `totalUsers`, `total1rdUsers`, `total2rdUsers`, and `total2rdUsersClaim`.

- `ManageInfo`: Holds details about managing the project, including `set1rdTokenAmount`, `set2rdTokenAmount`, `saleTokenPrice`, `tonPrice`, `hardCap`, `changeTOS`, `remainTON`, `changeTick`, `exchangeTOS`, and `adminWithdraw`.

- `ClaimInfo`: Contains information about claiming tokens, including `totalClaimCounts`, `firstClaimPercent`, `firstClaimTime`, `secondClaimTime`, and `claimInterval`.

- `Status`: Stores the current status of the project, including `currentStep`, `currentStepEndDate`, `nextStep`, and `nextStepDate`.

- `TokenInfo`: Contains information about the project's token, including `tokenName`, `tokenSymbol`, and `tokenTotalSupply`.

- `isSet`: A boolean indicating whether the project has been set or not.
