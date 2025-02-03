class CreateSystemTicketDescs < ActiveRecord::Migration[7.1]
  def change
    create_table :system_ticket_descs, id: :uuid do |t|
      t.string :ticket_number
      t.string :system_ticket_id
      t.string :system_type
      t.date :date_received
      t.date :start_date
      t.string :status
      t.json :data
      t.string :title
      t.text :description
      t.text :expected_goal

      t.timestamps
    end
  end
end
