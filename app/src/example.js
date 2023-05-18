import { Connection, PublicKey, Keypair } from "@solana/web3.js";

// Initialize connection to the Solana network
const connection = new Connection("https://api.devnet.solana.com");

// Set the public key of the Solana account that holds the counter data
const counterPublicKey = new PublicKey("...");

// Create a new transaction instruction to call the initialize_counter function
const initializeCounterInstruction = new TransactionInstruction({
    keys: [
        { pubkey: counterPublicKey, isSigner: false, isWritable: true },
    ],
    programId: new PublicKey("..."), // Replace the ellipsis with the public key of your Solana contract
    data: Buffer.from([]), // The initialize_counter function does not require any input data
});

// Create a new transaction object
const transaction = new Transaction().add(initializeCounterInstruction);

// Initialize the context object with the counter account
const context = {
    accounts: {
        counter: counterPublicKey,
    },
};

// Sign and send the transaction
await connection.sendTransaction(transaction, [signer], { preflightCommitment: "singleGossip" }, context);
