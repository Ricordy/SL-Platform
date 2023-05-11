# Where to store the images?

## IPFS? - NFT ENTRY, NFT LEVELS

## S3? 

## Db - Website, platform

## API

# From DB/API:

## Home

### Slider - DB

### Image URL - DB

### Our cars 

#### Car Address - BLOCKCHAIN/DB

#### Car title - DB

#### Car price - BLOCKCHAIN/DB

#### Car Image - DB

### Favorite? - NA

### My Investments

#### Active - HARDCODED
  - It will be presented the same info in all statuses? - (Active its the same) ; (upcoming, its like our cars) ; (finished have price and sold price if they dont go well, refunded status)
  - Car Address - BLOCKCHAIN/DB
  - Car title - DB
  - Car price - BLOCKCHAIN/DB
  - Car Image - DB
  - Car Status - DB 
  - Car progress - BLOCKCHAIN
#### Upcoming - DB
#### Finished - ONCE AFTER REFILL, IT ENTERS FINISHED PHASE WHERE YOU CAN WITHDRAW FUNDS) (If user does not withdraw in 3 months time (still to confirm), money goes to SL fund)

### My Puzzle

- Puzzle Address - BLOCKCHAIN/DB
- Puzzle title - HARDCODED
- Puzzle Image - IPFS/DB
- Puzzle progress - BLOCKCHAIN, UPDATES AFTER EVERY PUZZLE CLAIM OR PUZZLE BUY
- User invested so far - BLOCKCHAIN, UPDATES AFTER EVERY INVESTMENT IF POSSIBLE
- User collected puzzles (unique) - IPFS
- Posts - WEBSITE
  - Post image - DB
  - Post title - DB
  - Post short description - DB
  - Post full text - DB
- My investments
  - Upcoming? - DB
  - Favorites
    - Car title - NA
    - Car price - NA
  - Our suggestions for you (DB?)
  - What is the criteria to suggest cars? - Active cars, select 3, the ones that the user is not invested in preference - HARDCODED
- Investment Detail Page
  - Investment title - DB
  - Investment subtitle - DB
  - Investment Description - DB
  - Investment Address - BLOCKCHAIN/DB
  - Investment Chassis - DB
  - Investment Total Production - DB
  - Investment Total Model Production - DB 
  - Investment Color Combination - DB
  - Gallery (3 photos) - DB
  - Status (renewing) - DB
  - Price - BLOCKCHAIN/DB
  - Progress (%) - BLOCKCHAIN
  - Tasks( When the user has not invested) - 
    - Title - DB
    - Icon - DB
    - Status (Done, progrees, etc) - DB
  - Tasks(When the user has invested)
    - Title - DB
    - Icon - DB
    - Status (Done, progrees, etc) - DB
      - Deadline -  DB
      - Cost expectation - DB
      - Current cost - DB
      - Updates
        - Data - DB
        - Title - DB
        - Slider (photos)- DB
  - Investments (when user has not invested)
    - Total invested so far  - BLOCKCHAIN
    - Number of investors so far - BLOCKCHAIN (NEEDS TO BE TACKLED)
    - Return range - BLOCKCHAIN/DB 
    - Sales end - DB
    - Sales began - DB
    - Estimate claiming - DB
  - Investments (when user has invested)
    - Total invested so far - BLOCKCHAIN
    - Number of investors so far - BLOCKCHAIN (NEEDS TO BE TACKLED)
    - Return range - BLOCKCHAIN/DB
    - Sales end - DB
    - Sales began - DB
    - Estimate claiming - DB
    - Transactions (4 last transactions ) - BLOCKHAIN/DB , UPDATED FOR EVERY TRANSACTION THAT USER MAKES ON THAT SL CONTRACT
  - Car details - DB
  - Car title - DB
  - Car description (will be the same as the top??) - (WILL BE MORE EXTENSE) - DB
  - Car chart - DB
  - Our suggestions for you (DB?)
  - What is the criteria to suggest cars?

# Admin Panel

## Create a new Investment

### Level - Blockchain

### Payment Token Address - Blockchain

### Total Investment - Blockchain

## Create a new Batch

### Cap- Blockchain

### Images (link or the real image that will be uploaded)- Blockchain/DB

### Price - Blockchain

### URI - IPFS

## Change Investment status - Blockchain

# From Blockchain:

- Home
  - My Puzzle
    - Puzzle Address - Blockchain/DB
    - Puzzle title - DB
    - Puzzle Image - IPFS
    - Puzzle progress - Blockchain
    - User invested so far - Blockchain/DB
    - User collected puzzles (unique)- Blockchain
      How the user will mint the puzzle NFT?
- My Investments (Without Entry NFT) 
  - Total Invested until now - Blockchain
  - Return expected - DB
  - NFTs sold until now - Blockchain
- My Investments (With Entry NFT)
  - Total Invested in all investments - Blockchain
  - Any other info? 
  - Last transactions (It will be the last 4 transactions related to the platform contratcts?) - Blockchain/DB
  - Active (Status/Phases/Tasks???) 
    - Phase title - DB
    - Project price - BlockchaiN/DB
    - Phase progress - DB
  - Upcoming - DB
  - Finished (How to grab this info?) - Blockchain/DB
    - Phase title - DB
    - Project price - DB
    - Phase progress - DB
  - Our suggestions for you (DB?)
- Investment Detail Page 
  - Investments (when user has invested)
    - Transactions (4 last transactions) - Blockchain/DB
    - Button - Invest Now
      - User Payment Token balance - Blockchain
      - Minimun Investment - DB
      - Maximum Investment - Blockchain
    - Button - Withdraw - Blockchain
