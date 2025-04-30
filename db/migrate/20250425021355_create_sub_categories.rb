class CreateSubCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :sub_categories, id: :uuid do |t|
      t.uuid :category_id
      t.string :name
      t.string :code

      t.timestamps
    end
  end
end
