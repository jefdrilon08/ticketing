class Inventory < ApplicationRecord
  belongs_to :item
  belongs_to :supplier

  def brand_id
    data["brand_id"]
  end

  def brand_id=(value)
    data["brand_id"] = value
  end
  
  self.inheritance_column = :_type_disabled

  
end
