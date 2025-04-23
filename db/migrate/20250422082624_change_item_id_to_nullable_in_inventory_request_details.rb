class ChangeItemIdToNullableInInventoryRequestDetails < ActiveRecord::Migration[7.1]
  change_column_null :inventory_request_details, :item_id, true

  def change
  end
end
