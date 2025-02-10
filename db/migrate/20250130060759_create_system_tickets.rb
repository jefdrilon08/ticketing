class CreateSystemTickets < ActiveRecord::Migration[7.1]
  def change
    create_table :system_tickets, id: :uuid do |t|
      t.string :computer_system_id
      t.string :status
      t.string :user_id

      t.timestamps
    end
  end
end
