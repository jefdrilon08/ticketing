class AddIsRegularAndIncentivizedDateToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :is_regular, :boolean
    add_column :users, :incentivized_date, :date
  end
end
