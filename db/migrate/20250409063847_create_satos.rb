class CreateSatos < ActiveRecord::Migration[7.1]
  def change
    enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

    create_table :satos, id: :uuid, default: -> { "gen_random_uuid()" } do |t|
      t.string :name, null: false
      t.timestamps
    end
  end
end
