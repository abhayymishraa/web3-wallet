import { ethApiUrl, solanaApiUrl } from "./utils";

export const getAmountSol = async (address: string) => {
  try {
    const response = await fetch(
      solanaApiUrl || "https://api.mainnet-beta.solana.com",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [address],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.result.value / 1000000000);
    return data.result.value / 1000000000; // Convert lamports to SOL
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    throw new Error("Unexpected response structure");
    return;
  }
};

export const getAmountEth = async (address: string) => {
  try {
    const response = await fetch(ethApiUrl || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [address],
      }),
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    return parseInt(data.result, 16) / 1e18;
  } catch (e) {
    console.error("Failed to fetch balance:", e);
    throw new Error("Unexpected response structure");
    return;
  }
};
