class CreateComputerSystems < ActiveRecord::Migration[7.1]
  def change
    create_table :computer_systems, id: :uuid do |t|
      t.string :name
      t.string :description
      t.string :status
      t.json :data

      t.timestamps
    end
  end
end
