class ItemsCategory < ApplicationRecord
  has_many :items, foreign_key: :items_category_id
  has_many :sub_categories, foreign_key: :category_id
end