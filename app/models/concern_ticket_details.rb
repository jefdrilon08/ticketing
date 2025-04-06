class ConcernTicketDetail < ApplicationRecord
  belongs_to :concern_ticket
  belongs_to :concern_type, foreign_key: "concern_type_id", optional: false
  belongs_to :concern_for, foreign_key: "name_for_id", optional: true
  belongs_to :branch, optional: true
  belongs_to :requested_user, class_name: "User", foreign_key: "requested_user_id", optional: true
  belongs_to :assigned_user, class_name: "User", foreign_key: "assigned_user_id", optional: true

  has_many_attached :attachments
  
end
