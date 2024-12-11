class AddIsPublishedToAnnouncements < ActiveRecord::Migration[6.1]
  def change
    add_column :announcements, :is_published, :boolean
  end
end
