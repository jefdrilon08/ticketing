class AddFieldsToItemRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :item_requests, :date, :string
    add_column :item_requests, :description, :string
  end
end
