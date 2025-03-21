class ChangeNameForIdToUuidInConcernTicketDetails < ActiveRecord::Migration[7.1]
  def change
    change_column :concern_ticket_details, :name_for_id, :uuid, using: 'name_for_id::uuid'
  end
end
