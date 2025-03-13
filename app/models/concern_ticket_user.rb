class ConcernTicketUser < ApplicationRecord
    belongs_to :user
    belongs_to :concern_ticket
  end
  