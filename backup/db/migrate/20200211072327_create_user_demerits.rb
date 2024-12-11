class CreateUserDemerits < ActiveRecord::Migration[5.2]
  def change
    create_table :user_demerits, id: :uuid do |t|
      t.references :user, foreign_key: true, type: :uuid
      t.references :branch, foreign_key: true, type: :uuid
      t.string :status
      t.string :demerit_type
      t.string :role
      t.date :date_prepared
      t.date :date_approved
      t.date :date_of_action
      t.text :reason
      t.text :explanation
      t.json :data

      t.timestamps
    end
  end
end
