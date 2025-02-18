import React, { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

const SOLANA_NETWORK = "https://api.mainnet-beta.solana.com";

const App = () => {
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState(0);

    const connectWallet = async () => {
        if (window.solana) {
            try {
                const response = await window.solana.connect();
                setWallet(response.publicKey.toString());
                const connection = new Connection(SOLANA_NETWORK);
                const balance = await connection.getBalance(new PublicKey(response.publicKey));
                setBalance(balance / 1e9);
            } catch (error) {
                console.error("Wallet connection failed", error);
            }
        } else {
            alert("Install a Solana wallet like Phantom.");
        }
    };

    return (
        <div className="container">
            <h1>Solana Exchange</h1>
            {wallet ? (
                <div>
                    <p>Wallet: {wallet}</p>
                    <p>Balance: {balance} SOL</p>
                </div>
            ) : (
                <button onClick={connectWallet}>Connect Wallet</button>
            )}
        </div>
    );
};

export default App;
