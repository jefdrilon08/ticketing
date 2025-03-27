class CreateSystemTicketsUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :system_tickets_users, id: :uuid do |t|
      t.string :user_id
      t.string :status
      t.json :data

      t.timestamps
    end
  end
end
