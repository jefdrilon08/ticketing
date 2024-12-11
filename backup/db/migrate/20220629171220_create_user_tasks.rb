class CreateUserTasks < ActiveRecord::Migration[7.0]
  def change
    create_table :user_tasks, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :status
      t.string :task_type
      t.jsonb :data

      t.timestamps
    end
  end
end
