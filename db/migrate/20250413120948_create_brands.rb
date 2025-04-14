class CreateBrands < ActiveRecord::Migration[7.1]
  def change
    create_table :brands, id: :uuid do |t|
      t.string :name
      t.string :code
      t.references :item, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
