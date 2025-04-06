FactoryBot.define do
  factory :repair_maintenance do
    distribute_id { 1 }
    diagnosis { "MyText" }
    recomendation { "MyText" }
    status { "MyText" }
    ticket_id { 1 }
  end
end
