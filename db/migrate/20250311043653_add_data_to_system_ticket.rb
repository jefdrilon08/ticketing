class AddDataToSystemTicket < ActiveRecord::Migration[7.1]
  def change
    add_column :system_tickets, :data, :json
  end
end
