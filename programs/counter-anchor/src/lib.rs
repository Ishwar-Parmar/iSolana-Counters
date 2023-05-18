use anchor_lang::prelude::*;
// 9Bxt5hHicRnJSLy5f8KAWf2Cmgrcke9zqx1BfXGeF3jH
declare_id!("21spMzeE6F9r651WBWSJdJS4X6R59jPrTxPdFtVa5y16");

#[program]
pub mod counter_anchor {
    use super::*;

    pub fn initialize_counter(ctx: Context<InitializeCounter>) -> Result<()> {
        let counter: &mut Account<_> = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        ctx.accounts.counter.count += 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCounter<'info> {
    #[account(init, space=16+16, payer=payer)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

#[account]
pub struct Counter {
    count: u64,
}