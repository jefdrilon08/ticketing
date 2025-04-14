class AddItemRequestIdToItemRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :item_requests, :item_request_id, :integer
  end
end
