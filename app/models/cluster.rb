class Cluster < ApplicationRecord

  validates :name, presence: true
  validates :short_name, presence: true

  belongs_to :area
  has_many :branches, dependent: :delete_all
end
