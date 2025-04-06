class AddContactFieldsToSuppliers < ActiveRecord::Migration[7.1]
  def change
    add_column :suppliers, :contact_person, :string
    add_column :suppliers, :contact_number, :string
    add_column :suppliers, :address, :string
  end
end
