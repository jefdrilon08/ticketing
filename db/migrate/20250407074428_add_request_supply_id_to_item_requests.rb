class AddRequestSupplyIdToItemRequests < ActiveRecord::Migration[7.1]
  def change
    add_reference :item_requests, :request_supply, foreign_key: true, type: :uuid
  end
end