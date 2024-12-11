class CreateAnnouncements < ActiveRecord::Migration[5.2]
  def change
    create_table :announcements, id: :uuid do |t|
      t.string :title
      t.text :content
      t.references :user, type: :uuid, foreign_key: true

      t.timestamps
    end
  end
end
