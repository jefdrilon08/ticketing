class CreateItemDistributions < ActiveRecord::Migration[7.1]
  def change
    create_table :item_distributions, id: :uuid do |t|
      t.string :item_table
      t.integer :branch_id
      t.integer :employee_id
      t.integer :quantity
      t.string :distributed_by
      t.datetime :distributed_at
      t.string :receive_by

      t.timestamps
    end
  end
end
