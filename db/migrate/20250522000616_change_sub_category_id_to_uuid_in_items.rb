class ChangeSubCategoryIdToUuidInItems < ActiveRecord::Migration[6.1]
  def up

    remove_column :items, :sub_category_id

    add_column :items, :sub_category_id, :uuid
    add_index :items, :sub_category_id
  end

  def down
    remove_column :items, :sub_category_id
    add_column :items, :sub_category_id, :integer
  end
end
