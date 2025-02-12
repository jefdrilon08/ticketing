class ConcernTicket < ApplicationRecord
    belongs_to :computer_systems
    has_many :concern_ticket_details
end
