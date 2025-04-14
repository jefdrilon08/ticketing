class AddRemarksToItemRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :item_requests, :remarks, :text
  end
end
