import './App.css';
import { useEffect, useState } from 'react';
import { Connection, PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import {Program, AnchorProvider, web3} from '@project-serum/anchor';
import idl from './idl.json';

import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
require('@solana/wallet-adapter-react-ui/styles.css');



const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  new PhantomWalletAdapter()
]

// READ keypair from .env
var baseAccount = Keypair.fromSecretKey(new Uint8Array(process.env.REACT_APP_GLOBAL_COUNTER_ACCOUNT.split(',').map((e) => e*1)))

const opts = {
  preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);

function App() {
  const [value, setValue] = useState(null);
  const wallet = useWallet();
  const network = "https://api.devnet.solana.com";
  const connection = new Connection(network, opts.preflightCommitment);

  async function getProvider() {
    /* create the provider and return it to the caller */

    const provider = new AnchorProvider(
      connection, wallet, opts.preflightCommitment,
    );
    return provider;
  }

  useEffect(() => {
    
    createGlobalCounter()
    return () => {
      
    }
  }, [])
  

  async function createGlobalCounter() {
    const provider = await getProvider()
    // Get account information for the specified public key
    const accountInfo = await connection.getAccountInfo(baseAccount.publicKey);

    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider);
    try {
      if (accountInfo === null){
        console.log("ACCOUNT NOT EXIST");
        /* interact with the program via rpc */
        await program.rpc.initializeCounter({
          accounts: {
            counter:baseAccount.publicKey, // fetch global account from PDA
            payer: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          },
          signers: [baseAccount]
        });
      }
      const account = await program.account.counter.fetch(baseAccount.publicKey);
      console.log('account: ', account.count.toString());
      setValue(account.count.toString());
    } catch (err) {
      console.log("Transaction error: ", err);
    }
  }

  async function increment() {
    const provider = await getProvider();
    const program = new Program(idl, programID, provider);
    await program.rpc.increment({
      accounts: {
        counter:baseAccount.publicKey
      }
    });
  
    const account = await program.account.counter.fetch(baseAccount.publicKey);
    setValue(account.count.toString());
  }

  if (!wallet.connected) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div >
        <div>
          {
            !value && (<button onClick={createGlobalCounter}>Create counter</button>)
          }
          {
            value && <button onClick={increment}>Increment counter</button>
          }

          {
            value && value >= Number(0) ? (
              <><></><h3>Global Counter:  <span className="badge bg-primary">{value}</span></h3><h3>User Counter:  <span className="badge bg-primary">0</span></h3></>
            ) : (
              <h3>Please create the counter.</h3>
            )
          }
        </div>
      </div>
    );
  }
}

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
const AppWithProvider = () => (
  // <ConnectionProvider endpoint="https://api.devnet.solana.com">
  <ConnectionProvider endpoint="http://127.0.0.1:8899">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;
