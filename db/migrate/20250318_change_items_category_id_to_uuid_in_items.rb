class ChangeItemsCategoryIdToUuidInItems < ActiveRecord::Migration[6.0]
  def change
    change_column :items, :items_category_id, :uuid
  end
end
