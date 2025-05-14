class Item < ApplicationRecord
  has_many :borrow_transaction_items
  has_many :inventory_request_details

  has_many :children, class_name: 'Item', foreign_key: 'parent_id', dependent: :restrict_with_error
  belongs_to :parent, class_name: 'Item', optional: true

  belongs_to :item_category
  has_many :inventories
end