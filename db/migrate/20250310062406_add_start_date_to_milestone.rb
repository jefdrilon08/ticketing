class AddStartDateToMilestone < ActiveRecord::Migration[7.1]
    def change
      add_column :milestones, :start_date, :date
    end
  end