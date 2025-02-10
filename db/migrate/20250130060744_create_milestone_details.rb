class CreateMilestoneDetails < ActiveRecord::Migration[7.1]
  def change
    create_table :milestone_details, id: :uuid do |t|
      t.string :system_ticket_desc_id
      t.text :milestone_details
      t.string :status

      t.timestamps
    end
  end
end
