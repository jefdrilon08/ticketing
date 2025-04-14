class AddItemNameToItemRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :item_requests, :item_name, :string
  end
end
