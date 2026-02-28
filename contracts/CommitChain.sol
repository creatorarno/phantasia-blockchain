// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CommitChain
 * @notice Decentralized AI-Powered Open Source Contribution Protocol.
 *         Stores contribution metadata on-chain with IPFS proof + reputation.
 * @dev Optimized for Polygon Amoy. Deploy via Hardhat or Remix.
 *      ~55k gas per submit. getAllContributions() for frontend feed.
 */
contract CommitChain {
    // ──────────────────────────── Types ────────────────────────────
    struct Contribution {
        address contributor;
        string  title;
        string  ipfsCID;
        uint256 timestamp;
    }

    // ──────────────────────────── State ────────────────────────────
    Contribution[] public contributions;
    mapping(address => uint256) public reputation;

    // ──────────────────────────── Events ───────────────────────────
    event ContributionSubmitted(
        uint256 indexed id,
        address indexed contributor,
        string  title,
        string  ipfsCID,
        uint256 timestamp,
        uint256 newReputation
    );

    // ──────────────────────────── Write ────────────────────────────
    /**
     * @notice Submit a contribution. Pins the IPFS CID on-chain and
     *         awards +10 reputation to the caller.
     * @param _title   Short title of the contribution.
     * @param _ipfsCID CID returned by Pinata after pinning the JSON.
     */
    function submitContribution(
        string calldata _title,
        string calldata _ipfsCID
    ) external {
        require(bytes(_title).length > 0, "Empty title");
        require(bytes(_ipfsCID).length > 0, "Empty CID");

        uint256 id = contributions.length;

        contributions.push(Contribution({
            contributor: msg.sender,
            title:       _title,
            ipfsCID:     _ipfsCID,
            timestamp:   block.timestamp
        }));

        reputation[msg.sender] += 10;

        emit ContributionSubmitted(
            id,
            msg.sender,
            _title,
            _ipfsCID,
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
        returns (
            address contributor,
            string memory title,
            string memory ipfsCID,
            uint256 timestamp
        )
    {
        Contribution storage c = contributions[_id];
        return (c.contributor, c.title, c.ipfsCID, c.timestamp);
    }

    /**
     * @notice Returns all contributions. Use for frontend feed.
     * @dev    Gas-free view call; OK for < 500 entries.
     */
    function getAllContributions()
        external
        view
        returns (Contribution[] memory)
    {
        return contributions;
    }

    function getReputation(address _user) external view returns (uint256) {
        return reputation[_user];
    }
}
