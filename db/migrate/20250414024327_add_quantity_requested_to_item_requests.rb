class AddQuantityRequestedToItemRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :item_requests, :quantity_requested, :integer
  end
end
