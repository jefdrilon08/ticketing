class AddAssignedUserIdToConcernTicketDetails < ActiveRecord::Migration[7.1]
  def change
    add_column :concern_ticket_details, :assigned_user_id, :uuid
  end
end
