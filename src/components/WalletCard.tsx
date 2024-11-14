import { useState } from "react";
import { Button } from "./ui/button";
import { TbRefresh } from "react-icons/tb";

interface WalletCardProps {
  index: number;
  wallet: {
    address: string;
    secret: string;
    type: string;
    amount: number | undefined;
  };
  showSecret: boolean;
  onShowSecret: (index: number) => void;
  onCopySecret: (secret: string) => void;
  onRefreshBalance: (index: number) => void;
}

export function WalletCard({
  index,
  wallet,
  showSecret,
  onShowSecret,
  onCopySecret,
  onRefreshBalance,
}: WalletCardProps) {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await onRefreshBalance(index);
    setIsRefreshing(false);
  };

  return (
    <div className="border p-4 rounded">
      <div className="flex flex-col">Account type: {wallet.type}</div>
      <div className="flex flex-col break-words">
        <div>Balance:</div>
        <div className="flex justify-between items-center">
          <div>
            {wallet.amount == undefined ? "N/A" : wallet.amount} {"  "}
            {wallet.type === "Solana" ? "Sol" : "Eth"}
          </div>
          <Button
            variant="secondary"
            className="py-1 px-1 text-xs"
            onClick={handleRefreshClick}
            disabled={isRefreshing}
          >
            Refresh Balance
            <TbRefresh className={isRefreshing ? "animate-spin transform-0.5" : ""} />
          </Button>
        </div>
      </div>
      <div className="flex flex-col break-words">
        <div>publicKey:</div>
        <div>{wallet.address}</div>
      </div>
      <div className="break-words">
        <div>Secret:</div>
        {showSecret ? (
          <div>
            <div>{wallet.secret}</div>
            <Button onClick={() => onCopySecret(wallet.secret)}>Copy</Button>
          </div>
        ) : (
          <Button onClick={() => onShowSecret(index)}>Show Secret</Button>
        )}
      </div>
    </div>
  );
}
