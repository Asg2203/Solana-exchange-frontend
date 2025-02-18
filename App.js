import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "./config"; // Backend API URL

const App = () => {
    const [wallet, setWallet] = useState(null);
    const [balance, setBalance] = useState(0);
    const [isPremium, setIsPremium] = useState(false);
    const [message, setMessage] = useState("");

    // Create Wallet (Off-Chain)
    const createWallet = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/create-wallet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (data.wallet) {
                setWallet(data.wallet);
                setMessage("Wallet created! Save your private key securely.");
            } else {
                setMessage("Failed to create wallet.");
            }
        } catch (error) {
            console.error("Error creating wallet:", error);
        }
    };

    // Check Wallet Balance & Premium Status
    const checkWalletStatus = async () => {
        if (!wallet) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/check-wallet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet })
            });

            const data = await res.json();
            setBalance(data.balance);
            setIsPremium(data.isPremium);
            setMessage(data.message);
        } catch (error) {
            console.error("Error checking wallet:", error);
        }
    };

    useEffect(() => {
        if (wallet) {
            checkWalletStatus();
        }
    }, [wallet]);

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
                <button onClick={createWallet}>Create Wallet</button>
            )}
        </div>
    );
};

export default App;
