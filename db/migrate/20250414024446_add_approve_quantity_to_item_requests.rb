class AddApproveQuantityToItemRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :item_requests, :approve_quantity, :integer
  end
end
