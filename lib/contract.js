import { ethers } from 'ethers';
import { wrap } from '@oasisprotocol/sapphire-paratime';
import shapeshifterArtifact from '../artifacts/contracts/IdentityShapeshifter.sol/IdentityShapeshifter.json';

export const getProvider = () => {
  if (typeof window === 'undefined' || !window.ethereum) return null;
  return new ethers.providers.Web3Provider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) return null;
  const signer = provider.getSigner();
  // Wrap signer for Sapphire so calls are confidential on Sapphire networks
  return wrap(signer);
};

export const getShapeshifter = async (address) => {
  const provider = getProvider();
  const signer = await getSigner();
  if (!provider || !signer || !address) return null;
  return new ethers.Contract(address, shapeshifterArtifact.abi, signer);
};

export const getERC20 = async (address) => {
  const signer = await getSigner();
  if (!signer || !address) return null;
  const erc20Abi = [
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)'
  ];
  return new ethers.Contract(address, erc20Abi, signer);
};
