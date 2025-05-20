class AddEndDateToMilestone < ActiveRecord::Migration[7.1]
  def change
    add_column :milestones, :end_date, :date
  end
end
