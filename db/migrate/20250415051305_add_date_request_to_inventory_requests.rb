class AddDateRequestToInventoryRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :inventory_requests, :date_request, :date
  end
end
