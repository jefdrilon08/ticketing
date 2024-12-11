class RemoveUserAndAddAnotherOne < ActiveRecord::Migration[5.2]
  def change
    remove_column(:announcements, :user_id)
    add_column(:announcements, :user_id, :integer)
  end
end
