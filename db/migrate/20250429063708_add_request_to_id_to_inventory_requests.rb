class AddRequestToIdToInventoryRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :inventory_requests, :request_to_id, :integer
  end
end
