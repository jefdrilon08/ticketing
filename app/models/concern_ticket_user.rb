class ConcernTicketUser < ApplicationRecord
    
  belongs_to :user
  belongs_to :concern_ticket

  # CTU_ROLES = [
  #   "Developer",
  #   "Requester",
  # ]

  # CT_STATUSES = [
  #   "Active",
  #   "Inactive",
  # ]

end
  