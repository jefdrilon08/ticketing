class Item < ApplicationRecord
  has_many :borrow_transaction_items
  has_many :item_request_details
  belongs_to :items_category
end
