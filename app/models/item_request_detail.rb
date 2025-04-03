class ItemRequestDetail < ApplicationRecord
  belongs_to :item_request
  belongs_to :item

  self.table_name = 'ItemRequestDetails'
end
