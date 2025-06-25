class AddInventoryNumberToItemDistributions < ActiveRecord::Migration[7.1]
  def change
    add_column :item_distributions, :inventory_number, :string
  end
end
