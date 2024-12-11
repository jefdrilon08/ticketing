class AddUsernameAndFirstNameAndLastNameAndIdentificationNumberToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :username, :string
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :identification_number, :string
  end
end
