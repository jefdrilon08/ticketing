class AddItemIdToItemRequests < ActiveRecord::Migration[7.1]
  def change
    add_reference :item_requests, :item, foreign_key: true, type: :uuid
  end
end