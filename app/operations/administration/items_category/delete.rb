module Administration
  module ItemsCategory
    class Delete
      def initialize(config:)
        @id = config[:id]
      end

      def execute!
        items_category = ::ItemsCategory.find(@id)
        items_category.destroy!
        { message: 'Items category record successfully deleted' }
      end
    end
  end
end
