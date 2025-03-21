class CreateConcernTicketDetails < ActiveRecord::Migration[7.1]
  def change
    create_table :concern_ticket_details, id: :uuid do |t|
      t.string :ticket_number
      t.uuid :concern_ticket_id
      t.text :description
      t.json :data
      t.string :status
      t.string :name
      t.string :concern_type
      t.uuid :branch_id
      t.uuid :user_id

      t.timestamps
    end
  end
end
