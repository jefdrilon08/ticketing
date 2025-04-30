class AddAssignedPersonToMilestone < ActiveRecord::Migration[7.1]
  def change
    add_column :milestones, :assigned_person, :string
  end
end
