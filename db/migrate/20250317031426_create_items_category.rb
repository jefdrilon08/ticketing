class CreateItemsCategory < ActiveRecord::Migration[7.1]
  def change
    create_table :items_categories, id: :uuid do |t|
      t.string :code
      t.string :name
      t.string :status
      t.timestamps
    end
  end
end  