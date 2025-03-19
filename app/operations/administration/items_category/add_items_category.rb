module Administration
  module ItemsCategory
    class AddItemsCategory
      def initialize(config:)
        @config = config
        @name   = @config[:name]
        @code   = @config[:code]
        @status = @config[:status]
      end

      def execute!
        create_items_category
      end

      private

      def create_items_category
        items_category = ::ItemsCategory.new(
          name:   @name,
          code:   @code,
          status: @status
        )
        items_category.save!
        items_category
      end
    end
  end
end
