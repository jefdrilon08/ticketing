FactoryBot.define do
  factory :add_is_private_and_connect_to_item_to_concern_ticket do
    is_private { false }
    connect_to_item { false }
  end
end
