class AddAreaAndClusterToItemDistributions < ActiveRecord::Migration[7.1]
  def change
    add_column :item_distributions, :area_id, :uuid
    add_column :item_distributions, :cluster_id, :uuid
  end
end
