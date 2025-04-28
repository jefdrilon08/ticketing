class AddTicketCounterToConcernTickets < ActiveRecord::Migration[7.1]
  def change
    add_column :concern_tickets, :ticket_counter, :integer, default: 0, null: false
  end
end
