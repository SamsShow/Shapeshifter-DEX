// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@oasisprotocol/sapphire-contracts/contracts/Sapphire.sol";

/**
 * @title IdentityShapeshifter
 * @dev Smart contract for managing private personas on Oasis Sapphire
 * Utilizes Sapphire's confidential computation features for privacy
 */
contract IdentityShapeshifter is Ownable {
    // Use Sapphire's encryption utilities
    using Sapphire for bytes;
    using Sapphire for bytes32;
    using Sapphire for string;

    // Struct to represent a persona/identity
    struct Identity {
        string name;         // Plain text name
        bytes encryptedData; // Encrypted metadata about this persona
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
    // All identity data is kept confidential on the Sapphire ParaTime
    mapping(address => mapping(bytes32 => Identity)) private identities;
    
    // Mapping from user address => identity IDs
    mapping(address => bytes32[]) private userIdentityIds;
    
    // Mapping from user address => active identity ID
    mapping(address => bytes32) private activeIdentities;
    
    // Mapping from identity ID => swap history
    // This history is confidential and can only be accessed by the identity owner
    mapping(bytes32 => SwapDetails[]) private swapHistory;

    // Events
    event IdentityCreated(address indexed user, bytes32 indexed identityId);
    event ActiveIdentityChanged(address indexed user, bytes32 indexed identityId);
    event SwapExecuted(bytes32 indexed identityId, address inputToken, address outputToken);

    /**
     * @dev Create a new identity/persona with encrypted data
     * @param name Name of the identity
     * @param metadata Metadata about the identity to be encrypted
     * @return identityId The ID of the created identity
     */
    function createIdentity(string memory name, bytes memory metadata) public returns (bytes32) {
        // Generate a deterministic but unique identity ID
        bytes32 identityId = keccak256(abi.encodePacked(msg.sender, name, block.timestamp));
        
        require(!identities[msg.sender][identityId].exists, "Identity already exists");
        
        // Encrypt the metadata using Sapphire's confidential storage
        bytes memory encryptedData = metadata.encrypt();
        
        // Store the identity with encrypted data
        identities[msg.sender][identityId] = Identity({
            name: name,
            encryptedData: encryptedData,
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
     * @dev Execute a token swap via Uniswap with confidentiality
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
        // Get the active persona/identity for this transaction
        bytes32 identityId = activeIdentities[msg.sender];
        require(identityId != bytes32(0), "No active identity");
        
        // The following operations occur inside Oasis Sapphire's confidential execution environment
        // This means transaction details are hidden from public view
        
        // INTEGRATION NOTE: In a production implementation, we would
        // integrate with Uniswap Router contract here to perform the actual swap
        
        // For MVP demo purposes, simulate a swap with a mocked return value
        uint256 amountOut = amountIn * 98 / 100; // Simulated 2% slippage
        require(amountOut >= minAmountOut, "Slippage too high");
        
        // Log the swap under the active identity - this history is confidential
        // and can only be accessed by the wallet owner
        logTrade(identityId, inputToken, outputToken, amountIn, amountOut);
        
        // This event emits minimal information (not revealing amounts)
        // The actual swap details are confidential
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
     * @dev Get identity details with decryption
     * @param identityId ID of the identity
     * @return name Name of the identity
     * @return metadata Decrypted metadata about the identity
     */
    function getIdentity(bytes32 identityId) public view returns (string memory, bytes memory) {
        require(identities[msg.sender][identityId].exists, "Identity does not exist");
        
        Identity memory identity = identities[msg.sender][identityId];
        
        // Decrypt the data using Sapphire's confidential storage
        bytes memory decryptedData = identity.encryptedData.decrypt();
        
        return (identity.name, decryptedData);
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
     * This function leverages Oasis Sapphire's confidential queries
     * @param identityId ID of the identity
     * @return Array of swap details (confidentially provided)
     */
    function getSwapHistory(bytes32 identityId) public view returns (SwapDetails[] memory) {
        require(identities[msg.sender][identityId].exists, "Identity does not exist");
        
        // Access to this data is confidential thanks to Sapphire's privacy features
        // Even though we're returning the data directly, it's protected by the confidential execution environment
        return swapHistory[identityId];
    }
    
    /**
     * @dev Add support for mid-trade persona switching
     * This function allows a user to switch personas during a trade flow,
     * effectively splitting the trade history across multiple personas
     * @param identityId New identity to switch to
     * @param continueSwap Whether to continue with an ongoing swap
     */
    function midTradeSwitch(bytes32 identityId, bool continueSwap) public {
        require(identities[msg.sender][identityId].exists, "Identity does not exist");
        
        // Switch to the new identity
        activeIdentities[msg.sender] = identityId;
        
        emit ActiveIdentityChanged(msg.sender, identityId);
        
        // Additional logic for continued swaps would go here in a full implementation
    }
}
