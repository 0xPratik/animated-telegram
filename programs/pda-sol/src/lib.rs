use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::system_instruction;

declare_id!("CyxdU8GpY97R8zs778vAvvidTQeEVDrbfnBDBNY3eALF");

#[program]
pub mod pda_sol {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        let account = &mut ctx.accounts.pda_account;
        account.amount = amount;
        account.owner = ctx.accounts.authority.key();
        account.bump = *ctx.bumps.get("pda_account").unwrap();
        Ok(())
    }

    pub fn send_sol(ctx: Context<SendSol>, amount: u64) -> Result<()> {
        let ix =
            system_instruction::transfer(&ctx.accounts.pda.key(), &ctx.accounts.to.key(), amount);

        invoke_signed(
            &ix,
            &[
                ctx.accounts.pda.to_account_info(),
                ctx.accounts.to.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[&[&[*ctx.bumps.get("tide_shell_account").unwrap()]]],
        )?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init,payer= authority,seeds=[b"pratik".as_ref()],bump)]
    pub pda_account: Account<'info, PdaAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SendSol<'info> {
    #[account(mut)]
    pub to: SystemAccount<'info>,
    #[account(mut)]
    pub pda: Account<'info, PdaAccount>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct PdaAccount {
    pub amount: u64,
    pub bump: u8,
    pub owner: Pubkey,
}
