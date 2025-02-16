import { createPublicClient, http } from 'viem'
import { abstractTestnet, polygonAmoy } from 'viem/chains'

export function createViemPublicClient() {
    return createPublicClient({
        chain: abstractTestnet,
        transport: http(),
    });
}
