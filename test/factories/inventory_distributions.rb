FactoryBot.define do
  factory :inventory_distribution do
    inventory { nil }
    mr_number { "MyString" }
    cluster { nil }
    branch { nil }
    user { nil }
    quantity { 1 }
    date_distribute { "2025-04-06" }
    distribute_by { "MyString" }
    recieve_by { "MyString" }
    data { "" }
    type { "" }
    status { "MyString" }
  end
end
