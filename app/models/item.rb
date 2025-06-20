class Item < ApplicationRecord
  has_many :borrow_transaction_items
  has_many :inventory_request_details

  has_many :child_items, class_name: 'Item', foreign_key: 'parent_id', dependent: :restrict_with_error
  belongs_to :parent, class_name: 'Item', optional: true

  belongs_to :items_category, class_name: 'ItemsCategory', foreign_key: 'items_category_id', optional: true
  belongs_to :sub_category, optional: true
  belongs_to :brand, optional: true

  has_many :inventories

  validates :name, presence: true, uniqueness: { case_sensitive: false, message: "has already been taken" }
end