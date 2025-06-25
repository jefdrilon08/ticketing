class UpdateItemDistributionStructure < ActiveRecord::Migration[7.1]
  def change
    rename_column :item_distributions, :item_table, :item_id

    execute <<~SQL
      ALTER TABLE item_distributions
      ALTER COLUMN item_id TYPE uuid USING item_id::uuid;
    SQL

    add_column :item_distributions, :data, :json
  end
end
