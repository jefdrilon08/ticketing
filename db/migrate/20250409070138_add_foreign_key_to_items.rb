class AddForeignKeyToItems < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :items, :items_categories, column: :items_category_id, on_delete: :cascade
  end
end
