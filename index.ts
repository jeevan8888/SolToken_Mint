import { Connection, Keypair} from  "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, setAuthority, transfer } from  "@solana/spl-token";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
(async () => {
    const secret = [209,56,250,170,53,135,220,222,45,52,208,118,176,53,90,62,100,104,29,19,164,158,5,99,190,119,92,66,0,142,86,45,143,103,12,5,172,4,165,130,108,63,159,180,37,156,37,224,86,80,95,33,198,239,218,84,213,154,141,143,132,40,70,70];
    const fromWallet = Keypair.fromSecretKey(new Uint8Array(secret));
    console.log(fromWallet.publicKey);
    const mint = await createMint(
        connection, 
        fromWallet,            
        fromWallet.publicKey,  
        null,                  
        0                      
      );

      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey
      );

      const toWallet = Keypair.generate();
      console.log(toWallet);
      
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          fromWallet,
          mint,
          toWallet.publicKey
      );
      let signature = await mintTo(
        connection,
        fromWallet,               
        mint,                     
        fromTokenAccount.address, 
        fromWallet.publicKey,     
        1                   
      );
  
      await setAuthority(
        connection,
        fromWallet,         
        mint,                 
        fromWallet.publicKey,   
        0,                      
        null                   
      );
      signature = await transfer(
        connection,
        fromWallet,              
        fromTokenAccount.address, 
        toTokenAccount.address,  
        fromWallet.publicKey,      
        1                        
      );

      console.log("SIGNATURE", signature);
})()