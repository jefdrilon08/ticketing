FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    username { Faker::Internet.username(specifier: 10) }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    identification_number { Faker::Internet.username(specifier: 20) }
    roles { [] }
    password { 'password' }
    password_confirmation { 'password' }
    encrypted_password { User.new(password: password).encrypted_password }
    is_verified { true }
  end
end
