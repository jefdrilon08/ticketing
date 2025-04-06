class CreateRepairMaintenances < ActiveRecord::Migration[7.1]
  def change
    create_table :repair_maintenances, id: :uuid do |t|
      t.integer :distribute_id
      t.text :diagnosis
      t.text :recomendation
      t.text :status
      t.integer :ticket_id

      t.timestamps
    end
  end
end
