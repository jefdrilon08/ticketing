class UpdateItemDistributionFields < ActiveRecord::Migration[7.1]
  def up
    execute 'ALTER TABLE item_distributions ALTER COLUMN branch_id TYPE uuid USING branch_id::uuid'
    execute 'ALTER TABLE item_distributions ALTER COLUMN employee_id TYPE uuid USING employee_id::uuid'
    execute 'ALTER TABLE item_distributions ALTER COLUMN distributed_by TYPE uuid USING distributed_by::uuid'
    execute 'ALTER TABLE item_distributions ALTER COLUMN receive_by TYPE uuid USING receive_by::uuid'

    add_column :item_distributions, :mr_number, :string
  end

  def down
    execute 'ALTER TABLE item_distributions ALTER COLUMN branch_id TYPE string USING branch_id::text'
    execute 'ALTER TABLE item_distributions ALTER COLUMN employee_id TYPE string USING employee_id::text'
    execute 'ALTER TABLE item_distributions ALTER COLUMN distributed_by TYPE string USING distributed_by::text'
    execute 'ALTER TABLE item_distributions ALTER COLUMN receive_by TYPE string USING receive_by::text'

    remove_column :item_distributions, :mr_number
  end
end
