class CreateItemRequestDetails < ActiveRecord::Migration[7.1]
  def change
    create_table :item_request_details, id: :uuid do |t|
      t.references :item_request, null: false, foreign_key: true, type: :uuid  
      t.references :item, null: false, foreign_key: true, type: :uuid 
      t.integer :qty, null: false  
      t.string :status, null: false, default: "Pending"  # Default value

      t.timestamps
    end
  end
end
