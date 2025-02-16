import { createViemPublicClient } from '../viem/createViemPublicClient.js';
import { formatEther } from 'viem';
export const getBalanceTool = {
    definition: {
        type: 'function',
        function: {
            name: 'get_balance',
            description: 'Get the assts in the wallet',
            parameters: {
                type: 'object',
                properties: {
                    wallet: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]{40}$',
                        description: 'The wallet address to get the balance of',
                    }
                },
                required: ['wallet']
            }
        }
    },
    handler: async ({ wallet }) => {
        return await getBalance(wallet);
    }
};
async function getBalance(wallet) {
    const publicClient = createViemPublicClient();
    const balance = await publicClient.getBalance({ address: wallet });
    return formatEther(balance);
}
