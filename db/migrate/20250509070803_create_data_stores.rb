class CreateDataStores < ActiveRecord::Migration[7.1]
  def change
    create_table :data_stores, id: :uuid do |t|
      t.json :meta
      t.json :data
      t.string :status
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
