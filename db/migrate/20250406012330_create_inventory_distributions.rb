class CreateInventoryDistributions < ActiveRecord::Migration[7.1]
  def change
    create_table :inventory_distributions, id: :uuid do |t|
      t.references :inventory, null: false, foreign_key: true, type: :uuid
      t.string :mr_number
      t.references :cluster, null: false, foreign_key: true, type: :uuid
      t.references :branch, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.integer :quantity
      t.date :date_distribute
      t.string :distribute_by
      t.string :recieve_by
      t.json :data
      t.string :type
      t.string :status

      t.timestamps
    end
  end
end
