class Item < ApplicationRecord
  has_many :borrow_transaction_items

  has_many :children, class_name: 'Item', foreign_key: 'parent_id', dependent: :restrict_with_error
  belongs_to :parent, class_name: 'Item', optional: true

  belongs_to :items_category, class_name: 'ItemsCategory', foreign_key: 'items_category_id', optional: true
end
