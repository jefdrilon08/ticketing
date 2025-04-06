class AddFieldsToItems < ActiveRecord::Migration[7.1]
  def change
    add_column :items, :item_type, :string
    add_column :items, :is_parent, :boolean
    add_reference :items, :parent, foreign_key: { to_table: :items }, null: true, type: :uuid
  end
end
