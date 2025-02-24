class ConcernTicket < ApplicationRecord
    belongs_to :computer_system, optional: true
    has_many :concern_ticket_details, dependent: :destroy
end