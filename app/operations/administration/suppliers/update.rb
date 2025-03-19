module Administration
  module Suppliers
    class Update
      def initialize(config:)
        @config = config
        @suppliers = ::Supplier.find(config[:id])
        @code   = @config[:code]
        @name   = @config[:name]
        @status = @config[:status]
      end

      def execute!
        @suppliers.update!(
          code:   @code,
          name:   @name,
          status: @status
        )
        @suppliers
      end
    end
  end
end
