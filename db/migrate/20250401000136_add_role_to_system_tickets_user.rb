class AddRoleToSystemTicketsUser < ActiveRecord::Migration[7.1]
  def change
    add_column :system_tickets_users, :role, :string
  end
end
