FactoryBot.define do
  factory :concern_ticket do
    name { "MyString" }
    description { "MyText" }
    status { "MyString" }
    data { "" }
    computer_system_id { "" }
    user_id { "" }
  end
end
