// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract VotePortal {
    uint256 totalVotes;

    // event NewVote(Vote _vote);

    struct Vote {
        address voter; 
        uint256 timestamp; 
        uint option;
    }

    Vote[] votes;

    constructor() {
        console.log("Vote Smart Contract");
    }

    function vote(uint _option) public {
        totalVotes += 1;
        console.log("%s votou em %s", msg.sender, _option);
        votes.push(Vote(msg.sender, block.timestamp, _option));
        // emit NewVote(Vote({
        //     voter: msg.sender, 
        //     timestamp: block.timestamp, 
        //     title: _title, 
        //     description: _description
        // }));
    }

    function getAllVotes() public view returns (Vote[] memory) {
        return votes;
    }

    function getTotalVotes() public view returns (uint256) {
        // Opcional: Adicione esta linha se você quer ver o contrato imprimir o valor!
        // Também imprimirá em run.js.
        console.log("Temos %d tchauzinhos no total!", totalVotes);
        return totalVotes;
    }
}
