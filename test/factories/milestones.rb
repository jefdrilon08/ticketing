FactoryBot.define do
  factory :milestone do
    system_ticket_desc_id { "MyString" }
    milestone_details { "MyText" }
    status { "MyString" }
    target_date { "2025-02-03" }
  end
end
