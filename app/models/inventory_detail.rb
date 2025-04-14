class InventoryDetail < ApplicationRecord
  belongs_to :item_request

  # Optionally, you can add validations for these fields
  validates :unit, :quantity_requested, :approved_quantity, :remarks, :status, presence: true
end
