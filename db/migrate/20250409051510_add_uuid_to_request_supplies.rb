class AddUuidToRequestSupplies < ActiveRecord::Migration[7.1]
  def change
    add_column :request_supplies, :uuid, :uuid, default: 'gen_random_uuid()', null: false
  end
end
