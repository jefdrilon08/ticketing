class AddIsVerifiedAndVerificationTokenToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :is_verified, :boolean
    add_column :users, :verification_token, :string
  end
end
