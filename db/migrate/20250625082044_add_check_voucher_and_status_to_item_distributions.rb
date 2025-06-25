class AddCheckVoucherAndStatusToItemDistributions < ActiveRecord::Migration[7.1]
  def change
    add_column :item_distributions, :check_voucher, :string
    add_column :item_distributions, :status, :string
  end
end
