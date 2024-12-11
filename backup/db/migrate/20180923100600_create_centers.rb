class CreateCenters < ActiveRecord::Migration[5.2]
  def change
    create_table :centers, id: :uuid do |t|
      t.references :branch, type: :uuid, foreign_key: true
      t.string :name
      t.string :short_name

      t.timestamps
    end
  end
end
