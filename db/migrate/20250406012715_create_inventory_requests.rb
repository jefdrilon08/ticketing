class CreateInventoryRequests < ActiveRecord::Migration[7.1]
  def change
    create_table :inventory_requests, id: :uuid do |t|
      t.string :request_number
      t.date :date
      t.references :branch, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :status

      t.timestamps
    end
  end
end
