class CreateConcernTicketUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :concern_ticket_users, id: :uuid do |t|
      t.string :ticket_number
      t.string :status
      t.string :task
      t.uuid :concern_ticket_id

      t.timestamps
    end
  end
end
