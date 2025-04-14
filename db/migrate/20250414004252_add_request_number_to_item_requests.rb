class AddRequestNumberToItemRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :item_requests, :request_number, :string
  end
end
