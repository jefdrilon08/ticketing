namespace :system do
  task :restore_factory_settings => :environment do
    system("rails db:drop")
    system("rails db:create")
    system("rails db:migrate")

    # Create an admin user
    User.create!(
      email: "admin@koins.com",
      username: "admin",
      first_name: "admin",
      last_name: "admin",
      identification_number: "001",
      roles: ["MIS"],
      password: "password",
      password_confirmation: "password",
      is_verified: true
    )
  end
end
