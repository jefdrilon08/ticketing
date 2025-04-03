class CreateBorrowTransactionItems < ActiveRecord::Migration[7.1]
  def change
    create_table :borrow_transaction_items, id: :uuid do |t|
      t.references :borrow_transaction, null: false, foreign_key: true, type: :uuid
      t.references :item, null: false, foreign_key: true, type: :uuid
      t.integer :quantity
      t.string :status
      t.date :return_date

      t.timestamps
    end
  end
end
