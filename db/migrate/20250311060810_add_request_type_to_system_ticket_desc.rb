class AddRequestTypeToSystemTicketDesc < ActiveRecord::Migration[7.1]
  def change
    add_column :system_ticket_descs, :request_type, :string
  end
end
