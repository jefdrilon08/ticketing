class CreateConcernFors < ActiveRecord::Migration[7.1]
  def change
    create_table :concern_fors, id: :uuid do |t|
      t.uuid :concern_id
      t.string :name
      t.text :description
      t.string :status

      t.timestamps
    end
  end
end
