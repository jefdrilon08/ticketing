class CreateConcernTickets < ActiveRecord::Migration[7.1]
  def change
    create_table :concern_tickets, id: :uuid do |t|
      t.string :name
      t.text :description
      t.string :status
      t.json :data
      t.uuid :computer_system_id
      t.uuid :user_id

      t.timestamps
    end
  end
end
