import React, { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { API_BASE_URL } from "./config"; // Import backend API URL

const SOLANA_NETWORK = "https://api.mainnet-beta.solana.com";

const App = () => {
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState(0);
    const [isPremium, setIsPremium] = useState(false);
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

                // Check premium status with backend
                const res = await fetch(`${API_BASE_URL}/api/check-premium`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ wallet: publicKey }),
                });

                const data = await res.json();
                setIsPremium(data.isPremium);
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
                    <p>Status: {isPremium ? "✅ Premium Active" : "❌ Not Premium"}</p>
                    <p>{message}</p>
                </div>
            ) : (
                <button onClick={connectWallet}>Connect Wallet</button>
            )}
        </div>
    );
};

export default App;
