class CreateAddIsPrivateAndConnectToItemToConcernTickets < ActiveRecord::Migration[7.1]
  def change
    create_table :add_is_private_and_connect_to_item_to_concern_tickets, id: :uuid do |t|
      t.boolean :is_private
      t.boolean :connect_to_item

      t.timestamps
    end
  end
end
