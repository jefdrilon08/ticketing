class AddSystemNumberToComputerSystem < ActiveRecord::Migration[7.1]
  def change
    add_column :computer_systems, :system_number, :integer
  end
end
