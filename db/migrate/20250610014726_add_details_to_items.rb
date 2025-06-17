class AddDetailsToItems < ActiveRecord::Migration[7.1]
  def change
    add_column :items, :brand_id, :uuid
    add_column :items, :model, :string
    add_column :items, :date_purchased, :datetime
    add_column :items, :unit_price, :decimal
  end
end
