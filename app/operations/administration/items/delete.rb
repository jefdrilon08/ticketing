module Administration
  module Items
    class Delete
      def initialize(config:)
        @id = config[:id]
      end

      def execute!
        item = ::Item.find(@id)
        item.destroy!
        { message: 'Item record successfully deleted' }
      end
    end
  end
end