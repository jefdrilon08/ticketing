class CreateItemRequestDetails < ActiveRecord::Migration[7.1]
  def change
    create_table :item_request_details, id: :uuid do |t|
      t.references :item_request, null: false, foreign_key: true, type: :uuid  
      t.references :item, null: false, foreign_key: true, type: :uuid 
      t.integer :qty, null: false  
      t.string :status, null: false, default: "Pending"  # Default value
      t.uuid :item_request_id, null: false
      t.uuid :item_id, null: false
      t.integer :qty, null: false
      t.string :status, default: 'pending', null: false  
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false

      t.timestamps
    end
    add_index :ItemRequestDetails, :item_id
    add_index :ItemRequestDetails, :item_request_id
  end
end
