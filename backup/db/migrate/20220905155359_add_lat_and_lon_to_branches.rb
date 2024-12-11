class AddLatAndLonToBranches < ActiveRecord::Migration[7.0]
  def change
    add_column :branches, :lat, :decimal
    add_column :branches, :lon, :decimal
  end
end
