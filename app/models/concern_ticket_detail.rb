class ConcernTicketDetail < ApplicationRecord
    belongs_to :concern_ticket
    belongs_to :concern_type, foreign_key: "concern_type_id", optional: false
    belongs_to :concern_for, foreign_key: "name_for_id", optional: true
    has_one :concern_ticket_user, through: :concern_ticket
    belongs_to :branch, optional: true
    belongs_to :user
  end
  