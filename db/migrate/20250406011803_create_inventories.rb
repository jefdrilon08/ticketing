class CreateInventories < ActiveRecord::Migration[7.1]
  def change
    create_table :inventories, id: :uuid do |t|
      t.references :item, null: false, foreign_key: true, type: :uuid
      t.string :serial_number
      t.integer :quantity
      t.string :unit
      t.string :status
      t.date :purchase_date
      t.references :supplier, null: false, foreign_key: true, type: :uuid
      t.string :type
      t.json :data

      t.timestamps
    end
  end
end
