class AddSystemNumberToSystemTicket < ActiveRecord::Migration[7.1]
  def change
    add_column :system_tickets, :system_number, :integer
  end
end
