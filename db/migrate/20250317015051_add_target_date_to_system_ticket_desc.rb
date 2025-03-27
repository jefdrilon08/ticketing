class AddTargetDateToSystemTicketDesc < ActiveRecord::Migration[7.1]
  def change
    add_column :system_ticket_descs, :target_date, :date
  end
end
