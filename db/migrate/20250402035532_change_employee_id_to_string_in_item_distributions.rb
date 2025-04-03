class ChangeEmployeeIdToStringInItemDistributions < ActiveRecord::Migration[7.0]
  def change
    change_column :item_distributions, :employee_id, :string
    change_column :item_distributions, :branch_id, :string
  end
end