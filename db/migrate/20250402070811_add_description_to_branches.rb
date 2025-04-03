class AddDescriptionToBranches < ActiveRecord::Migration[7.1]
  def change
    add_column :branches, :description, :string
  end
end