module Administration
  module Suppliers
    class Delete
      def initialize(config:)
        @id = config[:id]
      end

      def execute!
        suppliers = ::Supplier.find(@id)
        suppliers.destroy!
        { message: 'Supplier record successfully deleted' }
      end
    end
  end
end
