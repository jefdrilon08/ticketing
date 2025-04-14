class AddItemRequestIdToItemRequestDetails < ActiveRecord::Migration[6.0]
  def change
    add_column :item_request_details, :item_request_id, :uuid, null: false, foreign_key: true
    add_index :item_request_details, :item_request_id
  end
end
