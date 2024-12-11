FactoryBot.define do
  factory :membership_arrangement do
    name { "KA-TEST" }
    data { { } }
  end

  factory :membership_type do
    name { "Regular" }
  end

  factory :member do
    branch { FactoryBot.create(:branch) }
    center { FactoryBot.create(:center, branch: branch) }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    middle_name { Faker::Name.middle_name }
    gender { 'female' }
    date_of_birth { Date.today - 20.years }
    civil_status { 'single' }
    mobile_number { '+639181111111' }
    identification_number { Faker::Internet.username }
    username { identification_number }
    place_of_birth { 'Manila' }
    status { 'pending' }
    member_type { 'Regular' }
    password { 'password' }
    password_confirmation { 'password' }
    encrypted_password { Member.new(password: password).encrypted_password }
    data { {} }
    meta { {} }
    email { Faker::Internet.email }
  end

  factory :online_application do
    branch { FactoryBot.create(:branch) }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    middle_name { Faker::Name.middle_name }
    gender { 'Female' }
    date_of_birth { Date.today - 20.years }
    civil_status { 'single' }
    mobile_number { '+639181111111' }
    place_of_birth { 'Manila' }
    status { 'for_verification' }
    data { {} }
    email { Faker::Internet.email }
    agreed_to_dp_terms { true }
    membership_type { FactoryBot.create(:membership_type) }
  end
end
