class CreateAreas < ActiveRecord::Migration[5.2]
  def change
    create_table :areas, id: :uuid do |t|
      t.string :name
      t.string :short_name

      t.timestamps
    end
  end
end
