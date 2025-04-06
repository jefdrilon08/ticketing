FactoryBot.define do
  factory :inventory_request do
    request_number { "MyString" }
    date { "2025-04-06" }
    branch { nil }
    user { nil }
    status { "MyString" }
  end
end
