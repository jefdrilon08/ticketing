FactoryBot.define do
  factory :inventory do
    item { nil }
    serial_number { "MyString" }
    quantity { 1 }
    unit { "MyString" }
    status { "MyString" }
    purchase_date { "2025-04-06" }
    supplier { nil }
    type { "" }
    data { "" }
  end
end
