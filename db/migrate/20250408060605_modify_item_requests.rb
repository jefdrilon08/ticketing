class ModifyItemRequests < ActiveRecord::Migration[6.0]
  def change
    # Clean invalid UUIDs by setting them to NULL
    ItemRequest.where.not('sato_id ~* \'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$\'')
               .update_all(sato_id: nil)

    # Safely change column types
    change_column :item_requests, :date_request, :datetime
    change_column :item_requests, :sato_id, :uuid, using: 'sato_id::uuid'
    change_column :item_requests, :user_id, :uuid
    change_column :item_requests, :status, :string
    change_column :item_requests, :id, :uuid, default: 'gen_random_uuid()', primary_key: true
    change_column :item_requests, :description, :string

    # Only add reference for item_id since request_supply_id already exists
    unless column_exists?(:item_requests, :item_id)
      add_reference :item_requests, :item, foreign_key: true
    end
  end
end
