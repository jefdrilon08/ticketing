# filepath: db/migrate/XXXXXXXXXX_add_active_to_branches.rb
class AddActiveToBranches < ActiveRecord::Migration[7.1]
  def change
    add_column :branches, :active, :boolean, default: true
  end
end