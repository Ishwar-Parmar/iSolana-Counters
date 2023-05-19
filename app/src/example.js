import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';

// Initialize a connection to the Solana network
const connection = new Connection('https://api.solana.com');

// Create a keypair for the account to be closed
const accountKeypair = Keypair.fromSecretKey(accountSecretKey);

// Specify the destination public key to receive the remaining lamports
const destinationPublicKey = new PublicKey(destinationPublicKeyStr);

// Specify the programId associated with the account
const programId = new PublicKey(programIdStr);

// Create a transaction to close the account
const transaction = new Transaction().add(
  SystemProgram.closeAccount({
    accountPubkey: accountKeypair.publicKey,
    destination: destinationPublicKey,
    programId,
  })
);

// Sign and send the transaction
const signature = await connection.sendTransaction(transaction, [accountKeypair]);

// Wait for confirmation
await connection.confirmTransaction(signature);
