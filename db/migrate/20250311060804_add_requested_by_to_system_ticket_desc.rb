class AddRequestedByToSystemTicketDesc < ActiveRecord::Migration[7.1]
  def change
    add_column :system_ticket_descs, :requested_by, :string
  end
end
