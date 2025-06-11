class ChangeItemIdNullConstraintOnBrands < ActiveRecord::Migration[7.1]

  def change
     change_column_null :brands, :item_id, true # Change true to false if you want to make it NOT NULL
  end
end
