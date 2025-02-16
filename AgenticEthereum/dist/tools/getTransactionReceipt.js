import { createViemPublicClient } from '../viem/createViemPublicClient.js';
export const getTransactionReceiptTool = {
    definition: {
        type: 'function',
        function: {
            name: 'get_transaction_receipt',
            description: 'Get the receipt of a transaction to check its status and details',
            parameters: {
                type: 'object',
                properties: {
                    hash: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]{64}$',
                        description: 'The transaction hash to get the receipt for',
                    }
                },
                required: ['hash']
            }
        }
    },
    handler: async ({ hash }) => {
        return await getTransactionReceipt(hash);
    }
};
function extractReceiptInfo(receipt) {
    return {
        status: receipt.status,
        hash: receipt.transactionHash,
        ...(receipt.status === 'reverted' && { error: 'Transaction reverted' })
    };
}
async function getTransactionReceipt(hash) {
    const publicClient = createViemPublicClient();
    const receipt = await publicClient.getTransactionReceipt({ hash });
    return extractReceiptInfo(receipt);
}
