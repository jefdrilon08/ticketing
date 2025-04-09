class Item < ApplicationRecord
  has_many :borrow_transaction_items
  has_many :inventories
end
