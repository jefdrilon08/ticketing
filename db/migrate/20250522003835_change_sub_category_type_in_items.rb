class ChangeSubCategoryTypeInItems < ActiveRecord::Migration[7.1]
  def change
    change_column :items, :sub_category, :string
  end
  
end
