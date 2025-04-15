module Administration
  module Suppliers
    class Update
      def initialize(config:)
        @config = config
        @suppliers = ::Supplier.find(config[:id])
        @code = @config[:code]
        @name = @config[:name]
        @status = @config[:status]
        @contact_person = @config[:contact_person]
        @contact_number = @config[:contact_number]
        @address = @config[:address]
      end

      def execute!
        @suppliers.update!(
          code: @code,
          name: @name,
          status: @status,
          contact_person: @contact_person,
          contact_number: @contact_number,
          address: @address
        )
        @suppliers
      end
    end
  end
end
