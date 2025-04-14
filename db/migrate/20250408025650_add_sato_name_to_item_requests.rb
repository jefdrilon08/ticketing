class AddSatoNameToItemRequests < ActiveRecord::Migration[6.0]
  def change
    add_column :item_requests, :sato_name, :string
  end
end
