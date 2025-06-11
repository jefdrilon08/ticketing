class AddSerialNumberToItems < ActiveRecord::Migration[7.1]
  def change
    add_column :items, :serial_number, :string
  end
end
