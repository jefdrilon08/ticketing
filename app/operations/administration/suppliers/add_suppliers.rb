module Administration
  module Suppliers
    class AddSuppliers
      def initialize(config:)
        @config = config
        @name            = @config[:name]
        @code            = @config[:code]
        @status          = @config[:status]
        @contact_person  = @config[:contact_person]
        @contact_number  = @config[:contact_number]
        @address         = @config[:address]

        Rails.logger.debug "AddSuppliers received params: #{@config.inspect}"
      end

      def execute!
        create_supplier
      end

      private

      def create_supplier
        supplier = ::Supplier.new(
          name:           @name,
          code:           @code,
          status:         @status,
          contact_person: @contact_person,
          contact_number: @contact_number,
          address:        @address
        )
        supplier.save!
        supplier
      end
    end
  end
end
