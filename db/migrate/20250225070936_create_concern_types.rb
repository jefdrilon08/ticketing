class CreateConcernTypes < ActiveRecord::Migration[7.1]
  def change
    create_table :concern_types, id: :uuid do |t|
      t.string :name
      t.string :description
      t.string :status

      t.timestamps
    end
  end
end
