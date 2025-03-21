class ChangeConcernTypeToConcernTypeId < ActiveRecord::Migration[7.1]
  def change
    remove_column :concern_ticket_details, :concern_type, :string
    add_column :concern_ticket_details, :concern_type_id, :uuid
  end
end
