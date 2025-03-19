module Administration
  module Suppliers
    class AddSuppliers
      def initialize(config:)
        @config = config
        @name   = @config[:name]
        @code   = @config[:code]
        @status = @config[:status]
      end

      def execute!
        create_suppliers
      end

      private

      def create_suppliers
        suppliers = ::Supplier.new(
          name:   @name,
          code:   @code,
          status: @status
        )
        suppliers.save!
        suppliers
      end
    end
  end
end
