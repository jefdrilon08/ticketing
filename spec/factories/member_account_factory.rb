FactoryBot.define do
  factory :member_account do
    member { FactoryBot.create(:member, status: 'active') }
    branch { member.branch }
    center { member.center }
    account_type { "SAVINGS" }
    account_subtype { "TEST" }
    maintaining_balance { 0.0 }
    status { 'active' }
  end
end
