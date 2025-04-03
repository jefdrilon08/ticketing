FactoryBot.define do
  factory :item_distribution do
    item_table { "MyString" }
    branch_id { 1 }
    employee_id { 1 }
    quantity { 1 }
    distributed_by { "MyString" }
    distributed_at { "2025-04-02 08:21:28" }
    receive_by { "MyString" }
  end
end
