class AddStatusDatesToItemRequests < ActiveRecord::Migration[7.1]
  def change
    add_column :item_requests, :status_dates, :jsonb
  end
end
