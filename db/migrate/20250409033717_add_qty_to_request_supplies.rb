class AddQtyToRequestSupplies < ActiveRecord::Migration[7.0]
  def change
    add_column :request_supplies, :qty, :integer
  end
end
