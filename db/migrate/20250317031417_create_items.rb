class CreateItems < ActiveRecord::Migration[7.1]
  def change
    create_table :items, id: :uuid do |t|
      t.string  :name,               null: false
      t.text    :description
      t.string  :status,             null: false
      t.string  :unit
      t.string  :mr_number
      t.string  :serial_number
      t.integer :total_quantity,     default: 0, null: false
      t.integer :available_quantity, default: 0, null: false
      t.references :items_category,  null: false, foreign_key: true, type: :uuid
      t.jsonb   :data,               default: {}
      t.timestamps
    end
  end
end
