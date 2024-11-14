import { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { createWallet } from "@/lib/createWallet";
import { walletTypes } from "@/lib/utils";
import { WalletCard } from "./WalletCard";
import { useToast } from "@/hooks/use-toast";
import { getAmountEth, getAmountSol } from "@/lib/RpcCalls";

interface SolanaWalletProps {
  mnemonic: string;
}

export default function SolanaWallet({ mnemonic }: SolanaWalletProps) {
  const [cindex, setCindex] = useState<number>(0);
  const [wallet, setWallet] = useState<
    Array<{
      address: string;
      secret: string;
      type: string;
      amount: number | undefined;
    }>
  >([]);
  const [selectedType, setSelectedType] = useState<string>(walletTypes[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showSecret, setShowSecret] = useState<{ [key: number]: boolean }>({});
  const { toast } = useToast();

  const handleShowSecret = (index: number) => {
    if (
      window.confirm(
        "Do you want to open it? Please don't show it to everyone."
      )
    ) {
      setShowSecret((prev) => ({ ...prev, [index]: true }));
    }
  };

  const handleCopySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    toast({ description: "Secret copied to clipboard" });
  };

  const handleRefreshBalance = async (index: number) => {
    const walletToUpdate = wallet[index];
    let updatedBalance: number | undefined;

    try {
      if (walletToUpdate.type === "Solana") {
        updatedBalance = await getAmountSol(walletToUpdate.address);
      } else if (walletToUpdate.type === "Ethereum") {
        updatedBalance = await getAmountEth(walletToUpdate.address);
      }
    } catch (e) {
      console.error("Failed to fetch balance:", e);
      toast({ description: "Failed to fetch balance", title: "Error" });
      return;
    }

    setWallet((prevWallet) =>
      prevWallet.map((w, i) =>
        i === index ? { ...w, amount: updatedBalance } : w
      )
    );
  };

  return (
    <div className="mx-auto font-bold px-40 w-full flex items-center justify-center flex-col">
      <div className="flex justify-between w-[900px] items-center border-b px-10 pb-4 mb-4">
        <h1 className="text-lg font-bold mb-4">Wallets</h1>
        <Button
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
          className="mb-4"
        >
          Generate Wallet
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-60 custom-scrollbar overflow-hidden">
        {wallet.map((w, index) => (
          <WalletCard
            key={index}
            index={index}
            wallet={w}
            showSecret={showSecret[index] || false}
            onShowSecret={handleShowSecret}
            onCopySecret={handleCopySecret}
            onRefreshBalance={handleRefreshBalance}
          />
        ))}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Wallet Type</DialogTitle>
          </DialogHeader>
          <Select onValueChange={(value) => setSelectedType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a wallet" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Wallet Type</SelectLabel>
                {walletTypes.map((type, index) => (
                  <SelectItem key={index} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button
              onClick={async () => {
                const newWallet = await createWallet({
                  selectedType,
                  mnemonic,
                  cindex,
                });
                if (newWallet) {
                  setWallet((prevWallet) => [newWallet, ...prevWallet]);
                }
                setCindex((prevCindex) => prevCindex + 1);
                setIsModalOpen(false);
              }}
            >
              Create Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
