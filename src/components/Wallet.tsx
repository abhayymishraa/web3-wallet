import CodeBlock from "@/components/CodeBlock";
import { generateMnemonic } from "bip39";
import { useState } from "react";
import { Button } from "./ui/button";
import { IoCopy } from "react-icons/io5";
import { TbCopyCheckFilled } from "react-icons/tb";
import SolanaWallet from "./SolanaWallet";

export default function Wallet() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [hide, setHide] = useState<boolean>(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonic);
    setHide(true);
    setCopied(true);
  };

  return (
    <div className="">
      <div className="flex flex-col gap-10 justify-center items-center py-10 overflow-y-hidden">
        {mnemonic === "" ? (
          <Button
            variant="secondary"
            onClick={() => setMnemonic(generateMnemonic())}
          >
            Generate Mnemonic
          </Button>
        ) : hide ? (
          <div> Hidden </div>
        ) : (
          <span className=" flex flex-col gap-10 w-full items-center">
            <CodeBlock darkMode className="max-w-2xl" value={mnemonic} />
            <Button variant="secondary" onClick={handleCopy}  >
              {copied ? (
                <span className="flex gap-2 text-center">
                  {" "}
                  Copied to Clipboard <TbCopyCheckFilled />{" "}
                </span>
              ) : (
                <span className="flex gap-2 text-center">
                  {" "}
                  <IoCopy /> Copy Mnemonic
                </span>
              )}
            </Button>
          </span>
        )}
      </div>
      {mnemonic === "" ? null : (
        <div className="flex pb-10 overflow-hidden  ">
          <SolanaWallet mnemonic={mnemonic} />
        </div>
      )}
    </div>
  );
}
