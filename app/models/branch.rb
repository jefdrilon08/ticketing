class Branch < ApplicationRecord
  validates :name, presence: true
  validates :short_name, presence: true

  belongs_to :cluster
  has_many :centers
  has_many :members
  has_many :user_branches

  def to_s
    name
  end

  def to_h
    to_obj
  end

  def to_obj
    {
      id:   self.id,
      name: self.name,
      lat:  self.lat,
      lon:  self.lon
    }
  end
end
