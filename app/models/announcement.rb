class Announcement < ApplicationRecord
  belongs_to :user 
  belongs_to :branch, optional: true

  validates :title, presence: true
  validates :content, presence: true
  validates :announced_at, presence: true

  has_one_attached :file_banner

  def to_s
    title
  end
end
