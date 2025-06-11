class SubCategory < ApplicationRecord
  belongs_to :category, class_name: "ItemsCategory", foreign_key: "category_id", optional: true
end

