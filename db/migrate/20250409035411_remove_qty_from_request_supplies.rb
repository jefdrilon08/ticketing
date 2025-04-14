class RemoveQtyFromRequestSupplies < ActiveRecord::Migration[7.1]
  def change
    remove_column :request_supplies, :qty, :integer
  end
end
