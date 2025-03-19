class ChangeItemsCategoryIdToUuidInItems < ActiveRecord::Migration[6.0]
  def change
    # Change the column type to uuid if you're using PostgreSQL
    change_column :items, :items_category_id, :uuid
    # Alternatively, if you prefer a string, you could use:
    # change_column :items, :items_category_id, :string
  end
end
