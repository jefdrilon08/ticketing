module Administration
  module Items
    class AddItems
      def initialize(config:)
        @config            = config
        @name              = @config[:name]
        @description       = @config[:description]
        @status            = @config[:status].presence || "Active"
        @unit              = @config[:unit]
        @items_category_id = @config[:items_category_id].presence
      end

      def execute!
        create_item
      end

      private

      def create_item
        item = ::Item.new(
          name:              @name,
          description:       @description,
          status:            @status,
          unit:              @unit,
          items_category_id: @items_category_id,
          data:              {}  
        )
        item.save!
        item
      end
    end
  end
end