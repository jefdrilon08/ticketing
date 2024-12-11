class AddAnnouncedAtToAnnouncements < ActiveRecord::Migration[6.1]
  def change
    add_column :announcements, :announced_at, :date
  end
end
