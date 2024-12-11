FactoryBot.define do
  factory :loan_application do
    member            { FactoryBot.create(:member, status: 'active') }
    amount            { 5000.00 }
    term              { 'weekly' }
    status            { 'pending' }
    num_installments  { 25 }
    reference_number  { Random.hex(3).upcase }
    loan_product      { FactoryBot.create(:loan_product) }
    date_applied      { Date.today }
  end
end
