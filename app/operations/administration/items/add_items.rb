module Administration
  module Items
    # This class is responsible for adding (creating) a new item record.
    class AddItems
      def initialize(config:)
        @config               = config
        @name                 = @config[:name]
        @description          = @config[:description]
        @status               = @config[:status].presence || "Active"
        @unit                 = @config[:unit]
        @items_category_id    = @config[:items_category_id].presence
        @sub_category_id      = @config[:sub_category_id].presence  
      end

      def execute!
        create_item
      end

      private

      def create_item
        item = ::Item.new(
          name:                 @name,
          description:          @description,
          status:               @status,
          unit:                 @unit,
          items_category_id:    @items_category_id,
          sub_category_id:      @sub_category_id,        
        )
        item.save!
        item
      end
    end
  end
end
