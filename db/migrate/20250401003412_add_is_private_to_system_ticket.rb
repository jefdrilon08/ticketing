class AddIsPrivateToSystemTicket < ActiveRecord::Migration[7.1]
  def change
    add_column :system_tickets, :is_private, :boolean
  end
end
