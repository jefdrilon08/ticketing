class CreateConcernTicketUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :concern_ticket_users, id: :uuid do |t|
      t.uuid :user_id
      t.string :status
      t.string :task

      t.timestamps
    end
  end
end
