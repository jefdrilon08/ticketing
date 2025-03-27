class CreateItemRequest < ActiveRecord::Migration[7.1]
  def change
    create_table :item_requests, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid  
      t.date :date_request, null: false 
      t.string :status, default: "Pending"
      t.jsonb :status_dates, default: {}  # This will store dates for each status

      t.timestamps
    end
  end
end
