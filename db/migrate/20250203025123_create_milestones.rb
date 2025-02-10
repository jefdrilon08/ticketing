class CreateMilestones < ActiveRecord::Migration[7.1]
  def change
    create_table :milestones, id: :uuid do |t|
      t.string :system_ticket_desc_id
      t.text :milestone_details
      t.string :status
      t.date :target_date

      t.timestamps
    end
  end
end
