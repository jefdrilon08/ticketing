class Message < ApplicationRecord
  STATUSES = [
    "unread",
    "read",
    "deleted",
    "close"
  ]

  belongs_to :member
  belongs_to :message, optional: true
  belongs_to :user, optional: true

  validates :content, presence: true
  validates :status, presence: true, inclusion: { in: STATUSES }

  scope :unread, -> { where(status: 'unread') }
  scope :read, -> { where(status: 'read') }
  scope :deleted, -> { where(status: 'deleted') }

  before_validation :load_defaults

  def load_defaults
    if self.new_record?
      self.status = "unread"
    end
  end
end
