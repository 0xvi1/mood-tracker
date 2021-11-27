//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MoodContract {
    uint256 private seed;

    uint256 public totalResponses = 0;
    struct Mood {
        address responder;
        string mood;
        uint256 postedAt;
    }
    // the array of moods that will be returned
    Mood[] moods;

    mapping(address => uint256) public lastSetMoodAt;

    event NewMood(address indexed from, uint256 timestamp, string mood);

    constructor() payable {
        console.log("Mood contract created");
    }

    function setMood(string memory _mood) public {
        // prevent the contract from being called too many times
        // ensure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
        require(
            lastSetMoodAt[msg.sender] + 30 seconds < block.timestamp,
            "Wait 30s"
        );

        //  Update the current timestamp we have for the user
        lastSetMoodAt[msg.sender] = block.timestamp;

        totalResponses++;
        moods.push(Mood(msg.sender, _mood, block.timestamp));

        console.log(msg.sender, " is feeling: ", _mood);

        emit NewMood(msg.sender, block.timestamp, _mood);

        // Generate a new seed for the next user that sends a wave
        seed = (block.difficulty + block.timestamp + seed) % 100;

        // Give a 50% chance that the user wins the prize.
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            // send the prize
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has..."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }
    }

    function getMoodsCount() public view returns (uint256) {
        console.log("Total responses: ", totalResponses);
        return totalResponses;
    }

    function getAllMoods() public view returns (Mood[] memory) {
        console.log("returing all moods");
        return moods;
    }
}
