class Area < ApplicationRecord
  validates :name, presence: true
  validates :short_name, presence: true

  has_many :clusters, dependent: :delete_all

end
