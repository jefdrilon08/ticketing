class InventoryRequestDetail < ApplicationRecord
  belongs_to :inventory_request
  belongs_to :item
end
