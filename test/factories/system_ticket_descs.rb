FactoryBot.define do
  factory :system_ticket_desc do
    ticket_number { "MyString" }
    system_ticket_id { "MyString" }
    system_type { "MyString" }
    date_received { "2025-01-30" }
    start_date { "2025-01-30" }
    status { "MyString" }
    data { "" }
    title { "MyString" }
    description { "MyText" }
    expected_goal { "MyText" }
  end
end
