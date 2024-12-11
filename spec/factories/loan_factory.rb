FactoryBot.define do
  factory :loan_product_category do
    name { Faker::Internet.username }
    code { Faker::Internet.username }
  end

  factory :loan_product do
    name                  { Faker::Internet.username }
    loan_product_category { FactoryBot.create(:loan_product_category) }
    max_loan_amount       { 100000 }
    min_loan_amount       { 5000 }
    is_entry_point        { true }
    monthly_interest_rate { 0.05 }
    denomination          { 5000 }
  end

  factory :loan do
    member                { FactoryBot.create(:member) }
    branch                { member.branch }
    center                { member.center }
    status                { "active" }
    loan_product          { FactoryBot.create(:loan_product) }
    principal             { 5000 }
    interest              { 750 }
    date_prepared         { Date.today }
    principal_balance     { 5000 }
    interest_balance      { 750 }
    principal_paid        { 0 }
    interest_paid         { 0 }
    data                  { { } }
    maturity_date         { Date.today + 1.year }
    first_date_of_payment { Date.today + 1.week }
    max_active_date       { Date.today + 2.weeks }
    payment_type          { "cash" }
    term                  { "weekly" }
  end
end
