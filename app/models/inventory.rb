class Inventory < ApplicationRecord
  belongs_to :item
  belongs_to :supplier

  self.inheritance_column = :_type_disabled

 
  def brand_id
    data["brand_id"]
  end

  def brand_id=(value)
    data["brand_id"] = value
  end
  
end
