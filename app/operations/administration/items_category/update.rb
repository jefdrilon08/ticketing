module Administration
  module ItemsCategory
    class Update
      def initialize(config:)
        @config = config
        @items_category = ::ItemsCategory.find(config[:id])
        @code   = @config[:code]
        @name   = @config[:name]
        @status = @config[:status]
      end

      def execute!
        @items_category.update!(
          code:   @code,
          name:   @name,
          status: @status
        )
        @items_category
      end
    end
  end
end
