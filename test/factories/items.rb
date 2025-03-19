FactoryBot.define do
  factory :item do
    name { "MyString" }
    code { "MyString" }
    status { false }
    item_category { nil }
  end
end
