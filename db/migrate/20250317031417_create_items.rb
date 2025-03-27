class CreateItems < ActiveRecord::Migration[7.1]
  def change
    create_table :items, id: :uuid do |t|
      t.string :name
      t.string :description
      t.string :status
      t.string :unit
      t.references :items_category, null: false, type: :uuid # Corrected type
      t.json :data
      t.timestamps
    end
  end
end

