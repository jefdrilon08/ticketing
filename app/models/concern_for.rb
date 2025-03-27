class ConcernFor < ApplicationRecord
    belongs_to :concern_ticket, foreign_key: :concern_id
    has_many :concern_ticket_details
end
