class ChangeSatoAndRequestSupplyToStrings < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :item_requests, :request_supplies if foreign_key_exists?(:item_requests, :request_supplies)
    change_column :item_requests, :request_supply_id, :string
    change_column :item_requests, :sato_id, :string
  end
end
