// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Contribution
 * @notice Minimal on-chain reputation via IPFS-pinned contributions.
 * @dev Deploy on Polygon Amoy Testnet via Remix. ~45k gas per submit.
 */
contract Contribution {
    // ──────────────────────────── State ────────────────────────────
    struct ContributionData {
        address contributor;
        string  ipfsHash;
        uint256 timestamp;
    }

    ContributionData[] public contributions;
    mapping(address => uint256) public reputation;

    // ──────────────────────────── Events ───────────────────────────
    event ContributionSubmitted(
        uint256 indexed id,
        address indexed contributor,
        string  ipfsHash,
        uint256 timestamp,
        uint256 newReputation
    );

    // ──────────────────────────── Core ─────────────────────────────
    /**
     * @notice Submit a contribution. Stores the IPFS hash on-chain and
     *         awards +10 reputation to the caller.
     * @param _ipfsHash  CID returned by Pinata after pinning the JSON.
     */
    function submitContribution(string calldata _ipfsHash) external {
        require(bytes(_ipfsHash).length > 0, "Empty IPFS hash");

        uint256 id = contributions.length;
        contributions.push(ContributionData({
            contributor: msg.sender,
            ipfsHash:    _ipfsHash,
            timestamp:   block.timestamp
        }));

        reputation[msg.sender] += 10;

        emit ContributionSubmitted(
            id,
            msg.sender,
            _ipfsHash,
            block.timestamp,
            reputation[msg.sender]
        );
    }

    // ──────────────────────────── Views ────────────────────────────
    function getContributionCount() external view returns (uint256) {
        return contributions.length;
    }

    function getContribution(uint256 _id)
        external
        view
        returns (address, string memory, uint256)
    {
        ContributionData storage c = contributions[_id];
        return (c.contributor, c.ipfsHash, c.timestamp);
    }

    function getReputation(address _user) external view returns (uint256) {
        return reputation[_user];
    }
}
