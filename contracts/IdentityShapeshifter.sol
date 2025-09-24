// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IdentityShapeshifter
 * @dev Smart contract for managing private personas on Oasis Sapphire
 */
contract IdentityShapeshifter is Ownable {
    // Struct to represent a persona/identity
    struct Identity {
        string name;
        bytes metadata; // Encrypted metadata about this persona
        bool exists;
    }

    // Struct to represent a swap transaction
    struct SwapDetails {
        address inputToken;
        address outputToken;
        uint256 amountIn;
        uint256 amountOut;
        uint256 timestamp;
    }

    // Mapping from user address => identity ID => Identity
    mapping(address => mapping(bytes32 => Identity)) private identities;
    
    // Mapping from user address => identity IDs
    mapping(address => bytes32[]) private userIdentityIds;
    
    // Mapping from user address => active identity ID
    mapping(address => bytes32) private activeIdentities;
    
    // Mapping from identity ID => swap history
    mapping(bytes32 => SwapDetails[]) private swapHistory;

    // Events
    event IdentityCreated(address indexed user, bytes32 indexed identityId);
    event ActiveIdentityChanged(address indexed user, bytes32 indexed identityId);
    event SwapExecuted(bytes32 indexed identityId, address inputToken, address outputToken);

    /**
     * @dev Create a new identity/persona
     * @param name Name of the identity
     * @param metadata Encrypted metadata about the identity
     * @return identityId The ID of the created identity
     */
    function createIdentity(string memory name, bytes memory metadata) public returns (bytes32) {
        bytes32 identityId = keccak256(abi.encodePacked(msg.sender, name, block.timestamp));
        
        require(!identities[msg.sender][identityId].exists, "Identity already exists");
        
        identities[msg.sender][identityId] = Identity({
            name: name,
            metadata: metadata,
            exists: true
        });
        
        userIdentityIds[msg.sender].push(identityId);
        
        // If this is the user's first identity, set it as active
        if (activeIdentities[msg.sender] == bytes32(0)) {
            activeIdentities[msg.sender] = identityId;
        }
        
        emit IdentityCreated(msg.sender, identityId);
        
        return identityId;
    }

    /**
     * @dev Switch the active identity
     * @param identityId The ID of the identity to make active
     */
    function switchIdentity(bytes32 identityId) public {
        require(identities[msg.sender][identityId].exists, "Identity does not exist");
        
        activeIdentities[msg.sender] = identityId;
        
        emit ActiveIdentityChanged(msg.sender, identityId);
    }

    /**
     * @dev Execute a token swap via Uniswap (placeholder - actual integration to be implemented)
     * @param inputToken Address of input token
     * @param outputToken Address of output token
     * @param amountIn Amount of input token
     * @param minAmountOut Minimum amount of output token expected
     * @return amountOut Actual amount of output token received
     */
    function swapTokens(
        address inputToken,
        address outputToken,
        uint256 amountIn,
        uint256 minAmountOut
    ) public returns (uint256) {
        bytes32 identityId = activeIdentities[msg.sender];
        require(identityId != bytes32(0), "No active identity");
        
        // Placeholder for actual Uniswap integration
        // In the MVP, we would call the Uniswap Router here
        
        // For now, simulate a swap with a mocked return value
        uint256 amountOut = amountIn * 98 / 100; // Simulated 2% slippage
        require(amountOut >= minAmountOut, "Slippage too high");
        
        // Log the swap under the active identity
        logTrade(identityId, inputToken, outputToken, amountIn, amountOut);
        
        emit SwapExecuted(identityId, inputToken, outputToken);
        
        return amountOut;
    }

    /**
     * @dev Log trade details under the specified identity
     * @param identityId ID of the identity to log under
     * @param inputToken Address of input token
     * @param outputToken Address of output token
     * @param amountIn Amount of input token
     * @param amountOut Amount of output token
     */
    function logTrade(
        bytes32 identityId,
        address inputToken,
        address outputToken,
        uint256 amountIn,
        uint256 amountOut
    ) internal {
        SwapDetails memory details = SwapDetails({
            inputToken: inputToken,
            outputToken: outputToken,
            amountIn: amountIn,
            amountOut: amountOut,
            timestamp: block.timestamp
        });
        
        swapHistory[identityId].push(details);
    }

    /**
     * @dev Get all identity IDs for a user
     * @return Array of identity IDs
     */
    function getIdentityIds() public view returns (bytes32[] memory) {
        return userIdentityIds[msg.sender];
    }

    /**
     * @dev Get identity details
     * @param identityId ID of the identity
     * @return name Name of the identity
     * @return metadata Encrypted metadata about the identity
     */
    function getIdentity(bytes32 identityId) public view returns (string memory, bytes memory) {
        require(identities[msg.sender][identityId].exists, "Identity does not exist");
        
        Identity memory identity = identities[msg.sender][identityId];
        return (identity.name, identity.metadata);
    }

    /**
     * @dev Get the active identity for a user
     * @return Active identity ID
     */
    function getActiveIdentity() public view returns (bytes32) {
        return activeIdentities[msg.sender];
    }

    /**
     * @dev Get swap history for an identity
     * @param identityId ID of the identity
     * @return Array of swap details
     */
    function getSwapHistory(bytes32 identityId) public view returns (SwapDetails[] memory) {
        require(identities[msg.sender][identityId].exists, "Identity does not exist");
        
        return swapHistory[identityId];
    }
}
