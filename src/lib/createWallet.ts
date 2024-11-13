import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { Wallet, HDNodeWallet } from "ethers";
import { getAmountEth, getAmountSol } from "./RpcCalls";

interface WalletParams {
  selectedType: string;
  mnemonic: string;
  cindex: number;
}

export async function createWallet({
  selectedType,
  mnemonic,
  cindex,
}: WalletParams) {
  const seed = await mnemonicToSeed(mnemonic);
  console.log(selectedType);
  if (selectedType === "Solana") {
    const path = `m/44'/501'/${cindex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    const base58Secret = bs58.encode(keypair.secretKey);
    const amount = await getAmountSol(keypair.publicKey.toString());
    return {
      address: keypair.publicKey.toString(),
      secret: base58Secret,
      type: "Solana",
      amount: amount,
    };
  } else if (selectedType === "Ethereum") {
    const path = `m/44'/60'/${cindex}'/0/0`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const node = hdNode.derivePath(path);
    const privateKey = node.privateKey;
    const wallet = new Wallet(privateKey);
    const amount = await getAmountEth(wallet.address);
    return {
      address: wallet.address,
      secret: privateKey,
      type: "Ethereum",
      amount: amount,
    };
  }
}
