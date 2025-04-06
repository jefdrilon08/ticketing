FactoryBot.define do
  factory :inventory_request_detail do
    inventory_request { nil }
    item { nil }
    description { "MyString" }
    unit { "MyString" }
    quantity_requested { 1 }
    approve_quantity { 1 }
    remarks { "MyString" }
    status { "MyString" }
  end
end
