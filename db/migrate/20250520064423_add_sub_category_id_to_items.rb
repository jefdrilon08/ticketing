class AddSubCategoryIdToItems < ActiveRecord::Migration[7.1]
  def change
    add_column :items, :sub_category_id, :integer
  end
end
