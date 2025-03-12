class DropComputerSystems < ActiveRecord::Migration[6.0]
  def up
    drop_table :computer_systems
  end

  def down
    create_table :computer_systems, id: :uuid do |t|
      t.string :name
      t.text :description
      t.string :status
      t.timestamps
    end
  end
end

