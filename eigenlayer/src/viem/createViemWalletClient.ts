import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abstractTestnet } from "viem/chains";
import { eip712WalletActions } from "viem/zksync";
const dotenv = require('dotenv');
dotenv.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_url = process.env.RPC_URL;


export function createViemWalletClient() {
    if (!process.env.PRIVATE_KEY) {
        throw new Error("⛔ PRIVATE_KEY environment variable is not set.");
    }
    const privateKey = process.env.PRIVATE_KEY.startsWith('0x') ? process.env.PRIVATE_KEY as `0x${string}` : `0x${process.env.PRIVATE_KEY}` as `0x${string}`;
    const account = privateKeyToAccount(privateKey);

    return createWalletClient({
        account,
        chain: abstractTestnet,
        transport: http(),
    }).extend(eip712WalletActions());
}
