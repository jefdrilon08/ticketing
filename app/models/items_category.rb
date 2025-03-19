class ItemsCategory < ApplicationRecord
  has_many :items, foreign_key: :items_category_id

end
