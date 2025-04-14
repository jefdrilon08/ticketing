class AddAvailableForDistributionToInventories < ActiveRecord::Migration[7.1]
  def change
    add_column :inventories, :available_for_distribution, :boolean
  end
end
