class CreateInventoryRequestDetails < ActiveRecord::Migration[7.1]
  def change
    create_table :inventory_request_details, id: :uuid do |t|
      t.references :inventory_request, null: false, foreign_key: true, type: :uuid
      t.references :item, null: false, foreign_key: true, type: :uuid
      t.string :description
      t.string :unit
      t.integer :quantity_requested
      t.integer :approve_quantity
      t.string :remarks
      t.string :status

      t.timestamps
    end
  end
end
