class RenameTypeColumnInInventoryDistributions < ActiveRecord::Migration[7.1]
  def change
    rename_column :inventory_distributions, :type, :distribution_type
  end
end
