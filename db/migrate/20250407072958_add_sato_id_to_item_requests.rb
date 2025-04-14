class AddSatoIdToItemRequests < ActiveRecord::Migration[7.0]
  def change
    add_column :item_requests, :sato_id, :uuid
  end
end