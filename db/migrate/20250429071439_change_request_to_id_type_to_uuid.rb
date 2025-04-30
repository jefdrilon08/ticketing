class ChangeRequestToIdTypeToUuid < ActiveRecord::Migration[6.1]
  def change
    remove_column :inventory_requests, :request_to_id
    add_column :inventory_requests, :request_to_id, :uuid
  end
end
