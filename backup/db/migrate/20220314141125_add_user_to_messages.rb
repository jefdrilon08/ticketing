class AddUserToMessages < ActiveRecord::Migration[6.1]
  def change
    add_reference :messages, :user, null: true, foreign_key: true, type: :uuid
  end
end
