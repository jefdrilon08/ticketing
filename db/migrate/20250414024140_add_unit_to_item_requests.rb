class AddUnitToItemRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :item_requests, :unit, :string
  end
end
