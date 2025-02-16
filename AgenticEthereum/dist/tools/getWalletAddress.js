import { createViemWalletClient } from '../viem/createViemWalletClient.js';
export const getWalletAddressTool = {
    definition: {
        type: 'function',
        function: {
            name: 'get_wallet_address',
            description: 'Get the connected wallet address',
            // No parameters needed since we're getting the connected wallet
            parameters: {
                type: 'object',
                properties: {},
                required: []
            }
        }
    },
    handler: async () => {
        return await getWalletAddress();
    }
};
async function getWalletAddress() {
    const walletClient = createViemWalletClient();
    console.log("Fetching connected wallet address...$(walletClient)");
    const [address] = await walletClient.getAddresses();
    console.log(`Connected wallet address: ${address}`);
    return address;
}
