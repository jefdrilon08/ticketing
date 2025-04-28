class AddUniqueIndexToTicketNumber < ActiveRecord::Migration[7.1]
  def change
    add_index :concern_ticket_details, :ticket_number, unique: true
  end
end
