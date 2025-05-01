class AddDataToInventoryRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :inventory_requests, :data, :json
  end
end
