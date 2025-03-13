class AddConcernIdToConcernTypes < ActiveRecord::Migration[7.1]
  def change
    add_column :concern_types, :concern_id, :uuid
  end
end
