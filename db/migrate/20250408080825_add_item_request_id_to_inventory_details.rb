class AddItemRequestIdToInventoryDetails < ActiveRecord::Migration[7.1]
  def change
    add_column :inventory_details, :item_request_id, :integer
  end
end
