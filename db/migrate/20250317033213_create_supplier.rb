class CreateSupplier < ActiveRecord::Migration[7.1]
  def change
    create_table :suppliers, id: :uuid do |t|
      t.string :name
      t.string :code
      t.boolean :status
      t.json :data

      t.timestamps
    end
  end
end
