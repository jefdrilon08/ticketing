class ChangeSatoIdToStringInItemRequests < ActiveRecord::Migration[7.1]
  def change
    change_column :item_requests, :sato_id, :string
  end
end
