class SubCategory < ApplicationRecord
  belongs_to :items_category, class_name: "ItemsCategory", foreign_key: "category_id"
end