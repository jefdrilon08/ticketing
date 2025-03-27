class RenameConcernIdToConcernTicketIdInConcernTicketUsers < ActiveRecord::Migration[6.0]
  def change
    rename_column :concern_ticket_users, :concern_id, :concern_ticket_id
  end
end

