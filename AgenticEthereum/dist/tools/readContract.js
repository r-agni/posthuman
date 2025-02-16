import { createViemPublicClient } from '../viem/createViemPublicClient.js';
export const readContractTool = {
    definition: {
        type: 'function',
        function: {
            name: 'read_contract',
            description: 'Read data from a smart contract',
            parameters: {
                type: 'object',
                properties: {
                    contract: {
                        type: 'string',
                        pattern: '^0x[a-fA-F0-9]{40}$',
                        description: 'The contract address to read from',
                    },
                    functionName: {
                        type: 'string',
                        description: 'The name of the function to call',
                    },
                    args: {
                        type: 'array',
                        description: 'Optional arguments for the function call',
                        items: {
                            type: 'string'
                        }
                    },
                    abi: {
                        type: 'array',
                        description: 'The ABI of the contract',
                        items: {
                            type: 'object'
                        }
                    }
                },
                required: ['contract', 'functionName', 'abi']
            }
        }
    },
    handler: async ({ contract, functionName, args = [], abi }) => {
        return await readContract(contract, functionName, args, abi);
    }
};
export async function readContract(contract, functionName, args, abi) {
    const publicClient = createViemPublicClient();
    const result = await publicClient.readContract({
        address: contract,
        abi,
        functionName,
        args
    });
    if (typeof result === 'bigint') {
        return result.toString();
    }
    return result;
}
