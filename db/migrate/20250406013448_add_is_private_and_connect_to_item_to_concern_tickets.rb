class AddIsPrivateAndConnectToItemToConcernTickets < ActiveRecord::Migration[7.1]
  def change
    add_column :concern_tickets, :is_private, :boolean
    add_column :concern_tickets, :connect_to_item, :boolean
  end
end
