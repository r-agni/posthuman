import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { holesky } from "viem/chains";
import { eip712WalletActions } from "viem/zksync";
export function createViemWalletClient() {
    if (!process.env.PRIVATE_KEY) {
        throw new Error("⛔ PRIVATE_KEY environment variable is not set.");
    }
    const account = privateKeyToAccount(process.env.PRIVATE_KEY);
    return createWalletClient({
        account,
        chain: holesky,
        transport: http(),
    }).extend(eip712WalletActions());
}
