class ConcernTicket < ApplicationRecord
  has_many :concern_ticket_details
  has_many :concern_types, foreign_key: :concern_id
  has_many :concern_fors, foreign_key: :concern_id
  has_many :concern_ticket_users, foreign_key: :concern_ticket_id
  belongs_to :user, optional: true # Assuming some tickets might not have an assigned user
  belongs_to :computer_system, optional: true
  has_many :data_stores
end
