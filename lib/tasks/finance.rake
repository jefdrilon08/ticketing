namespace :finance do
  task :autorenew_time_deposit_accounts => :environment do
    user_id = Settings.time_deposit_autorenewal_user_id

    args  = {
      user_id: user_id
    }

    ProcessAutorenewalAccounts.perform_later(args)
  end
end
