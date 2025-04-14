class CreateItemRequestDetails < ActiveRecord::Migration[6.0]
  def change
    create_table :item_request_details, id: :uuid do |t|
      t.uuid :item_request_id, null: false
      t.uuid :item_id, null: false
      t.integer :quantity_requested
      t.integer :approved_quantity
      t.string :remarks
      t.string :status

      t.timestamps
    end

    add_foreign_key :item_request_details, :item_requests, column: :item_request_id
    add_foreign_key :item_request_details, :items, column: :item_id
    add_index :item_request_details, :item_request_id
  end
end
