class ActivityLog < ApplicationRecord
  ACTIVITY_TYPES  = [
    "approval",
    "display",
    "deletion",
    "correction",
    "modification",
    "create",
    "delete",
    "upload"
  ]

  validates :content, presence: true

  def user
    ReadOnlyUser.where(id: self.data.with_indifferent_access[:user_id]).first
  end
end
