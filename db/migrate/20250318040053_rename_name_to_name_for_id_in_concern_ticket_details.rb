class RenameNameToNameForIdInConcernTicketDetails < ActiveRecord::Migration[7.0]
  def change
    rename_column :concern_ticket_details, :name, :name_for_id
  end
end

