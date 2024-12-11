class CreateClusters < ActiveRecord::Migration[5.2]
  def change
    create_table :clusters, id: :uuid do |t|
      t.references :area, type: :uuid, foreign_key: true
      t.string :name
      t.string :short_name

      t.timestamps
    end
  end
end
