class AddBranchToAnnouncements < ActiveRecord::Migration[6.1]
  def change
    add_reference :announcements, :branch, null: true, foreign_key: true, type: :uuid
  end
end
