class AddTicketNameToConcernTickets < ActiveRecord::Migration[7.1]
  def change
    add_column :concern_tickets, :ticket_name, :string
  end
end
