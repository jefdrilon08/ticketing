class CreateBranches < ActiveRecord::Migration[5.2]
  def change
    create_table :branches, id: :uuid do |t|
      t.references :cluster, type: :uuid, foreign_key: true
      t.string :name
      t.string :short_name

      t.timestamps
    end
  end
end
