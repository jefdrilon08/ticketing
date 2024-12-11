class AddPublishedAtToAnnouncements < ActiveRecord::Migration[6.1]
  def change
    add_column :announcements, :published_at, :date
  end
end
