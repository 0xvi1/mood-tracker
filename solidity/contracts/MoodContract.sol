//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MoodContract {
    mapping(address => string) public moodsMapping;
    // address[] responders;
    // string[] moods;

    uint256 public totalResponses = 0;
    struct Mood {
        address responder;
        string mood;
    }
    Mood[] moods;

    constructor() {
        console.log("Mood contract created");
    }

    function setMood(string memory _mood) public {
        totalResponses++;
        moods.push(Mood(msg.sender, _mood));
    }

    function getMoodsCount() public view returns (uint256) {
        return totalResponses;
    }

    function getAllMoods() public view returns (Mood[] memory) {
        return moods;
    }
}
