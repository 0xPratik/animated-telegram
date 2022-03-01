import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {web3} from "@project-serum/anchor"
import { PdaSol } from "../target/types/pda_sol";

describe("pda-sol", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.PdaSol as Program<PdaSol>;

  it("Is initialized!", async () => {
    // Add your test here.
    const [pda, _pdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("pratik")],
      program.programId
    );
    console.log(pda.toString());
    console.log("PDA BUMP",_pdaBump);
    const tx = await program.rpc.initialize(new anchor.BN(1),{
      accounts:{
        authority: program.provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        pdaAccount: pda
      }
    })
    console.log("Your transaction signature", tx);
  });
  it("do an airdrop to pda",async() => {
    const [pda, _pdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("pratik")],
      program.programId
    );
    console.log("PDA ACCOUNT",pda.toString());
    const connection = new web3.Connection("http://localhost:8899", "confirmed");
    const res = await connection.requestAirdrop(pda,web3.LAMPORTS_PER_SOL*2)
    console.log("RES",res);
  })

  it("Should be able to send SOL to the TO address",async () => {
    const [pda, _pdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("pratik")],
      program.programId
    );
   
    console.log(pda.toString());
    const amount = web3.LAMPORTS_PER_SOL*1;
    console.log("AMOUNT",amount);
    console.log("THis is the Wallet key",program.provider.wallet.publicKey.toString())
    const data = await program.rpc.sendSol(new anchor.BN(amount),{
      accounts:{
        pda:pda,
        systemProgram:web3.SystemProgram.programId,
        to:program.provider.wallet.publicKey
      }
    })

    console.log("This is the PDA send",data);
  })
  it("Should be a able to read the initialize account",async() => {
    const [pda, _pdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("pratik")],
      program.programId
    );

    const data = await program.account.pdaAccount.fetch(pda);

    console.log(data);
  })
});
