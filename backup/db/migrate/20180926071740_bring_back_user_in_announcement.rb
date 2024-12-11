class BringBackUserInAnnouncement < ActiveRecord::Migration[5.2]
  def change
    remove_column(:announcements, :user_id, :integer)
    add_column(:announcements, :user_id, :uuid)
  end
end
