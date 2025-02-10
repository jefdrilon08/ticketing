class CreateSystemTicketUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :system_ticket_users, id: :uuid do |t|
      t.string :user_id
      t.json :status

      t.timestamps
    end
  end
end
