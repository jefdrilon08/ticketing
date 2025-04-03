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
        @mr_number            = @config[:mr_number]
        @serial_number        = @config[:serial_number]
        # Convert quantity values to integers since they are stored as integers
        @total_quantity       = @config[:total_quantity].to_i
        @available_quantity   = @config[:available_quantity].to_i
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
          mr_number:            @mr_number,
          serial_number:        @serial_number,
          total_quantity:       @total_quantity,
          available_quantity:   @available_quantity,
          data:                 {}  # Defaults to empty JSONB
        )
        item.save!
        item
      end
    end
  end
end