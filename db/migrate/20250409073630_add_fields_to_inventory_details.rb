class AddFieldsToInventoryDetails < ActiveRecord::Migration[6.0]
  def change
    add_column :inventory_details, :unit, :string
    add_column :inventory_details, :quantity_requested, :integer
    add_column :inventory_details, :approved_quantity, :integer
    add_column :inventory_details, :remarks, :text
    add_column :inventory_details, :status, :string
  end
end
