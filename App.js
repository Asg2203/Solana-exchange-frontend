import React, { useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { API_BASE_URL } from "./config"; // Import API URL

const SOLANA_NETWORK = "https://api.mainnet-beta.solana.com";

const App = () => {
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState(0);
    const [message, setMessage] = useState("");

    const connectWallet = async () => {
        if (window.solana) {
            try {
                const response = await window.solana.connect();
                const publicKey = response.publicKey.toString();
                setWallet(publicKey);
                
                const connection = new Connection(SOLANA_NETWORK);
                const balance = await connection.getBalance(new PublicKey(publicKey));
                setBalance(balance / 1e9);

                // Send wallet address to backend
                const res = await fetch(`${API_BASE_URL}/api/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ wallet: publicKey }),
                });

                const data = await res.json();
                setMessage(data.message);

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
                    <p>{message}</p>
                </div>
            ) : (
                <button onClick={connectWallet}>Connect Wallet</button>
            )}
        </div>
    );
};

export default App;
