// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract BallotPortal {
    uint256 totalBallots;

    event NewBallot(Ballot _ballot);

    // enum ProposalOrder { first, second, third, fourth }

    struct Proposal {
      string name;
      uint order;
      uint numberOfVotes;
    //   ProposalOrder order;
    }

    struct Ballot {
        address author; 
        uint256 timestamp; 
        string title; 
        string description;
        // Proposal p1;
        // Proposal p2;
        // Proposal p3;
        // Proposal p4;
    }

    struct Vote {
        address voter; 
        uint256 timestamp; 
        uint proposalOption;
    }

    Ballot[] ballots;

    constructor() {
        console.log("Ballot Smart Contract");
    }

    // function vote( Ballot memory _ballot, uint _proposalOption) public pure {
    //     // Ballot storage ballot = ballots[msg.sender];
    //     if(_ballot.p1.order == _proposalOption) {
    //         _ballot.p1.numberOfVotes = _ballot.p1.numberOfVotes += 1;
    //     }
    //     if(_ballot.p2.order == _proposalOption) {
    //         _ballot.p2.numberOfVotes = _ballot.p2.numberOfVotes += 1;
    //     }
    //     if(_ballot.p3.order == _proposalOption) {
    //         _ballot.p3.numberOfVotes =  _ballot.p3.numberOfVotes+=1;
    //     }
    //     if(_ballot.p4.order == _proposalOption) {
    //         _ballot.p4.numberOfVotes = _ballot.p4.numberOfVotes += 1;
    //     }
    // }
// Proposal memory _p1, Proposal memory _p2, Proposal memory _p3, Proposal memory _p4
    function createBallot(string memory _title, string memory _description) public returns (Ballot memory) {
        totalBallots += 1;
        console.log("%s criou uma votacao com o titulo: %s", msg.sender, _title);
        Ballot memory createdBallot = Ballot({
                author: msg.sender, 
                timestamp: block.timestamp, 
                title: _title, 
                description: _description
            });
        ballots.push(createdBallot);
        return createdBallot;
    }

    function getAllBallots() public view returns (Ballot[] memory) {
        return ballots;
    }

    function getTotalBallots() public view returns (uint256) {
        console.log("Temos %d tchauzinhos no total!", totalBallots);
        return totalBallots;
    }
}
