class AddUuidToItemDistributions < ActiveRecord::Migration[7.0]
  def change
    add_column :item_distributions, :uuid, :string
    add_index :item_distributions, :uuid, unique: true
  end
end