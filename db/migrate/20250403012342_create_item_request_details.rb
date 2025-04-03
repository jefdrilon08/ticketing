class CreateItemRequestDetails < ActiveRecord::Migration[7.1]
  def change
    create_table :ItemRequestDetails, id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
      t.uuid :item_request_id, null: false
      t.uuid :item_id, null: false
      t.integer :qty, null: false
      t.string :status, default: 'pending', null: false  
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
    end

    add_index :ItemRequestDetails, :item_id
    add_index :ItemRequestDetails, :item_request_id
  end
end
