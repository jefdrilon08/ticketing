class RemoveSystemNumberFromComputerSystem < ActiveRecord::Migration[7.1]
  def change
    remove_column :computer_systems, :system_number, :integer
  end
end
