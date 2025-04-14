class AddForeignKeyToItemRequestDetails < ActiveRecord::Migration[6.0]
  def change
    add_foreign_key :item_request_details, :item_requests, column: :item_request_id
  end
end
