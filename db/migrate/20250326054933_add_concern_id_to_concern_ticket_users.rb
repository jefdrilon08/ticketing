class AddConcernIdToConcernTicketUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :concern_ticket_users, :concern_id, :uuid
  end
end
