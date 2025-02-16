import { createPublicClient, http } from 'viem'
import { holesky } from 'viem/chains'

export function createViemPublicClient() {
    return createPublicClient({
        chain: holesky,
        transport: http(),
    });
}
