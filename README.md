# Arweave Crowdfunding Dapp [Contest](https://gitcoin.co/issue/ArweaveTeam/Bounties/12/3274)
### A completely decentralized crowdfunding app with a verifiable and immutable project plan.

- [x] The first batch of funds is released to the creator to start the project.

- [x] The creator publishes a report at the end of each milestone. If a majority (perhaps a majority with a quorum, or supermajority) of backers are unsatisfied with the progress, they can then vote to suspend the project, stop future payouts, and return the remaining funds to the backers. If completed, the next batch is released to the creator.

- [x] Follow the same rules until all milestones are completed, and all funds have been distributed, or until backers vote to suspend the project.

- [x] You should aim for a viable permaweb-based app with the smart contract fully respecting the challenge description.

- [x] The project needs to be open-source and released on GitHub for us to review the entire source.

## Backend

The backend is written in solidity and it fully complies with the project requirments.

While the desired crowdfund format is a huge improvement from the way ICOs are currently run, we wanted to also support the possibility for crowdfund creators to pick different formats. In order to do this, we have designed the smart contracts from the groundup to support this by boiling down all operations into `tasks` and using a `StructuredLinkedList` to efficiently store all data required.

Right now, the desired format is `(Funding -> Milestone -> Voting)`, this is the default behaviour of the backend. However, it is possible to extend this functionality to allow a variety of formats. For example we could replicate Dash's DAO with this format `(Funding -> Voting -> Milestone)`, in which users get to vote on what to work on next.

## Frontend

The frontend is written using next.js, react, and mobx-state-tree.

Our aim is to provide the most user-friendly UI possible which makes it extremely easy for a creator or viewer to use.

A hash of the website will be provided as soon as possible.

## Setup locally

### Backend
1. `npm install`
2. `npx truffle develop`
3. \> `migrate`
4. `mkdir -p client/src/contracts && cp build/contracts/Crowdfund.json client/src/contracts/$1`

### Frontend
1. `cd client`
2. `npm install`
3. `npm run build`
4. `npm run start`

## Team Members
* [Ashley Oytac](https://github.com/AshleyOyt)
* [Steve Noni](https://github.com/nionis)
