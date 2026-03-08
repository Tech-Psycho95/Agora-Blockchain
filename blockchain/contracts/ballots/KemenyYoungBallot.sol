// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interface/IBallot.sol";

contract KemenyYoungBallot is IBallot {
    address public electionContract;

    uint[][] private votes;

    modifier onlyOwner() {
        if (msg.sender != electionContract) revert OwnerPermissioned();
        _;
    }

    constructor(address _electionAddress) {
        electionContract = _electionAddress;
    }

    function init(uint totalCandidates) external onlyOwner {
        // Initialize the votes array for the number of candidates
        votes = new uint[][](totalCandidates);
        for (uint i = 0; i < totalCandidates; i++) {
            votes[i] = new uint[](totalCandidates);
        }
    }

    function vote(uint[] memory voteArr) external onlyOwner {
        uint totalCandidates = votes.length;
        if (voteArr.length != totalCandidates) revert VoteInputLength();
        _validatePermutation(voteArr, totalCandidates);

        // Store the ranking for this voter
        for (uint i = 0; i < totalCandidates; i++) {
            for (uint j = i + 1; j < totalCandidates; j++) {
                votes[voteArr[i]][voteArr[j]] += 1;
            }
        }
    }

    function getVotes() external view onlyOwner returns (uint256[][] memory) {
        return votes;
    }

    function _validatePermutation(uint[] memory arr, uint n) internal pure {
        uint bitmap = 0;
        for (uint i = 0; i < n; i++) {
            if (arr[i] >= n) revert InvalidVotePermutation();
            uint bit = 1 << arr[i];
            if (bitmap & bit != 0) revert InvalidVotePermutation();
            bitmap |= bit;
        }
    }
}
