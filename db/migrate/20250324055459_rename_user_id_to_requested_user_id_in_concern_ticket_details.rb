class RenameUserIdToRequestedUserIdInConcernTicketDetails < ActiveRecord::Migration[6.1]
  def change
    rename_column :concern_ticket_details, :user_id, :requested_user_id
  end
end

