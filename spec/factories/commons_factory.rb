FactoryBot.define do
  factory :area do
    name        { Faker::Name.last_name }
    short_name  { Faker::Name.first_name }
  end

  factory :cluster do
    area        { FactoryBot.create(:area) }
    name        { Faker::Name.last_name }
    short_name  { Faker::Name.first_name }
  end

  factory :branch do
    cluster         { FactoryBot.create(:cluster) }
    name            { Faker::Name.last_name }
    short_name      { Faker::Name.first_name }
    member_counter  { 0 }
  end

  factory :center do
    branch      { FactoryBot.create(:branch) }
    name        { Faker::Name.last_name }
    short_name  { Faker::Name.first_name }
    user        { FactoryBot.create(:user) }
  end

  factory :user_branch do
    user    { FactoryBot.create(:user) }
    branch  { FactoryBot.create(:branch) }
    active  { true }
  end
end
