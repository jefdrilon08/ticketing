class ConcernTicketDetail < ApplicationRecord
    belongs_to :concern_ticket
    belongs_to :concern_type
    has_one :concern_ticket_user, through: :concern_ticket
    belongs_to :branch, optional: true
  end
  