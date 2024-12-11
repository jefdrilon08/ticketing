class CreateUserBranches < ActiveRecord::Migration[5.2]
  def change
    create_table :user_branches, id: :uuid do |t|
      t.uuid :user_id
      t.uuid :branch_id
      t.boolean :active

      t.timestamps
    end
  end
end
