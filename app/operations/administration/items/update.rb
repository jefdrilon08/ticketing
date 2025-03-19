module Administration
  module Items
    class Update
      def initialize(config:)
        @config = config
        @item   = ::Item.find(config[:id])
        @name   = @config[:name]
        @description = @config[:description]
        @status = @config[:status]
        @unit   = @config[:unit]
        @items_category_id = @config[:items_category_id].presence
      end

      def execute!
        @item.update!(
          name:              @name,
          description:       @description,
          status:            @status,
          unit:              @unit,
          items_category_id: @items_category_id
        )
        @item
      end
    end
  end
end