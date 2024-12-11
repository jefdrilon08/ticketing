class AddUserIdToCenters < ActiveRecord::Migration[5.2]
  def change
    add_column :centers, :user_id, :uuid
  end
end
