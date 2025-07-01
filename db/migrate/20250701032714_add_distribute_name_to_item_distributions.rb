class AddDistributeNameToItemDistributions < ActiveRecord::Migration[7.1]
  def change
    add_column :item_distributions, :distribute_name, :string
  end
end
