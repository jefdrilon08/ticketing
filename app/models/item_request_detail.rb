class ItemRequestDetail < ApplicationRecord
  belongs_to :item_request
  belongs_to :item
end
# filepath: app/models/item.rb
class Item < ApplicationRecord
  has_many :item_request_details
end

# filepath: app/models/item_request.rb
class ItemRequest < ApplicationRecord
  has_many :item_request_details
end