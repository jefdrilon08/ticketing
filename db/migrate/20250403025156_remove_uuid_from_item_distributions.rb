class RemoveUuidFromItemDistributions < ActiveRecord::Migration[7.0]
  def change
    remove_column :item_distributions, :uuid, :string
  end
end