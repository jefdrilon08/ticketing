FactoryBot.define do
  factory :concern_ticket_detail do
    ticket_number { "MyString" }
    concern_ticket_id { "" }
    description { "MyText" }
    data { "" }
    status { "MyString" }
    name { "MyString" }
    concern_type { "MyString" }
    branch_id { "" }
    user_id { "" }
  end
end
