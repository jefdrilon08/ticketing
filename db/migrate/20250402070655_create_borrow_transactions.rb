class CreateBorrowTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :borrow_transactions, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :branch, null: false, foreign_key: true, type: :uuid
      t.date :request_date
      t.string :status, default: 'pending'  # Set default value to "pending"

      t.timestamps
    end
  end
end
