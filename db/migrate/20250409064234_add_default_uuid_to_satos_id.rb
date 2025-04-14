class AddDefaultUuidToSatosId < ActiveRecord::Migration[7.1]
  def change
    change_column_default :satos, :id, -> { "gen_random_uuid()" }
  end
end
