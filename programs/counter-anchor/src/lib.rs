use anchor_lang::prelude::*;
// 9Bxt5hHicRnJSLy5f8KAWf2Cmgrcke9zqx1BfXGeF3jH
declare_id!("4AK9rQH7e9NoduAwu6vtbCkbYPkEnYJsPdrs3ATPhwKJ");

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

    //User counter
    pub fn create_user_counter(ctx: Context<CreateUserCounter>) -> Result<()>{
        let counter: &mut Account<_> = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }
    pub fn increment_user_counter(ctx: Context<IncrementUserCounter>) -> Result<()>{
        ctx.accounts.counter.count += 1;
        Ok(())
    }
}

//Validation structs
//Global Counter
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


//User specific counter
#[derive(Accounts)]
pub struct CreateUserCounter<'info>{
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(init, space=16+16, payer=payer, seeds = [b"IndividualCounter", payer.key().as_ref()], bump)]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct IncrementUserCounter<'info> {
    pub payer: Signer<'info>,
    #[account(mut, seeds = [b"IndividualCounter", payer.key().as_ref()], bump)]
    pub counter: Account<'info, Counter>,
}

#[account]
pub struct Counter {
    count: u64,
}