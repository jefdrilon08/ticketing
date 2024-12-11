class CreateActivityLogs < ActiveRecord::Migration[5.2]
  def change
    create_table :activity_logs, id: :uuid do |t|
      t.string :content
      t.string :activity_type
      t.json :data

      t.timestamps
    end
  end
end
