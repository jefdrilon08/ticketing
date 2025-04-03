module Administration
  module Items
    # This class is responsible for updating an existing item record.
    class Update
      def initialize(config:)
        @config             = config
        @item               = ::Item.find(config[:id])
        @name               = @config[:name]
        @description        = @config[:description]
        @status             = @config[:status]
        @unit               = @config[:unit]
        @items_category_id  = @config[:items_category_id].presence
        @mr_number          = @config[:mr_number]
        @serial_number      = @config[:serial_number]
        @total_quantity     = @config[:total_quantity].to_i
        @available_quantity = @config[:available_quantity].to_i
      end

      def execute!
        @item.update!(
          name:               @name,
          description:        @description,
          status:             @status,
          unit:               @unit,
          items_category_id:  @items_category_id,
          mr_number:          @mr_number,
          serial_number:      @serial_number,
          total_quantity:     @total_quantity,
          available_quantity: @available_quantity
        )
        @item
      end
    end
  end
end