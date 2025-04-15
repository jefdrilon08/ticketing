class ItemRequestDetail < ApplicationRecord
  belongs_to :item_request
  belongs_to :item

  self.table_name = 'ItemRequestDetails'
end

class Item < ApplicationRecord
  has_many :item_request_details
end

class ItemRequest < ApplicationRecord
  has_many :item_request_details
end