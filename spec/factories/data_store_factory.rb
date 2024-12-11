FactoryBot.define do
  factory :data_store do
    meta        { { branch_id: "some-branch", branch_name: "some branch", as_of: Date.today.to_s, data_store_type: "REPAYMENT_RATES" } }
    data        { { } }
    status      { "done" }
    as_of       { Date.today }
    start_date  { Date.today }
    end_date    { Date.today }
  end
end
