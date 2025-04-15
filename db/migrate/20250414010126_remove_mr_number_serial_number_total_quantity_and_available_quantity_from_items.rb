class RemoveMrNumberSerialNumberTotalQuantityAndAvailableQuantityFromItems < ActiveRecord::Migration[6.0]
  def change
    remove_column :items, :mr_number, :string
    remove_column :items, :serial_number, :string
    remove_column :items, :total_quantity, :integer
    remove_column :items, :available_quantity, :integer
  end
end
