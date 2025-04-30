class InventoryRequestDetail < ApplicationRecord
  belongs_to :inventory_request
  belongs_to :item, optional: true
  validates :status, inclusion: { in: ['pending', 'for checking', 'approved', 'delivered'] }
  # validates :item_id, presence: true
  # validates :description, presence: true
  # validates :unit, presence: true
  # validates :quantity_requested, presence: true, numericality: { greater_than: 0 }        
end