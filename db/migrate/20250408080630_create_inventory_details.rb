class CreateInventoryDetails < ActiveRecord::Migration[7.1]
  def change
    create_table :inventory_details, id: :uuid do |t|

      t.timestamps
    end
  end
end
