class RenameSubCategoryToSubCategoryNameInItems < ActiveRecord::Migration[7.0]
  def change
    rename_column :items, :sub_category_id, :sub_category_name
  end
end
