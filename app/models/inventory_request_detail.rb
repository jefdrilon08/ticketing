class InventoryRequestDetail < ApplicationRecord
  belongs_to :inventory_request
  belongs_to :item, optional: true
  belongs_to :user
  belongs_to :branch
  belongs_to :cluster
  has_one :item_category, through: :item

  validates :status, inclusion: { in: ['pending', 'for checking', 'approved', 'delivered'] }
  validates :quantity_requested, presence: true, numericality: { greater_than: 0 }

  # Uncomment the following lines if these fields are required
  # validates :item_id, presence: true
  # validates :description, presence: true
  # validates :unit, presence: true
end
