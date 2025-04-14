class Inventory < ApplicationRecord
  belongs_to :item
  belongs_to :supplier

  self.inheritance_column = :_type_disabled
end
