class AddSystemTicketIdToSystemTicketsUser < ActiveRecord::Migration[7.1]
  def change
    add_column :system_tickets_users, :system_ticket_id, :string
  end
end
