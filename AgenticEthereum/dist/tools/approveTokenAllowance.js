import { createViemWalletClient } from '../viem/createViemWalletClient.js';
import { ERC20_ABI } from '../const/contractDetails.js';
export const approveTokenAllowanceTool = {
    definition: {
        type: 'function',
        function: {
            name: 'approve_token_allowance',
            description: 'Approve a spender to use a specific amount of ERC20 tokens',
            parameters: {
                type: 'object',
                properties: {
                    tokenAddress: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]{40}$',
                        description: 'The ERC20 token contract address',
                    },
                    spenderAddress: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]{40}$',
                        description: 'The address to approve for spending tokens',
                    },
                    amount: {
                        type: 'string',
                        description: 'The amount of tokens to approve (in wei)',
                    }
                },
                required: ['tokenAddress', 'spenderAddress', 'amount']
            }
        }
    },
    handler: async ({ tokenAddress, spenderAddress, amount }) => {
        return await approveTokenAllowance({ tokenAddress, spenderAddress, amount });
    }
};
async function approveTokenAllowance({ tokenAddress, spenderAddress, amount }) {
    const walletClient = createViemWalletClient();
    const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spenderAddress, BigInt(amount)],
    });
    return hash;
}
