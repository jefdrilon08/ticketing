class RenameCurrentDateToBranchCurrentDateInBranches < ActiveRecord::Migration[7.1]
  def change
    rename_column :branches, :current_date, :branch_current_date
  end
end
