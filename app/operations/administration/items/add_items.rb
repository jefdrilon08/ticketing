module Administration
  module Items
    class AddItems
      def initialize(config:)
        @config               = config
        @name                 = @config[:name]
        @description          = @config[:description]
        @status               = @config[:status].presence || "Active"
        @unit                 = @config[:unit]
        @items_category_id    = @config[:items_category_id].presence
        @sub_category_id      = @config[:sub_category_id].presence
        @brand_id             = @config[:brand_id]
        @model                = @config[:model]
        @serial_number        = @config[:serial_number]
        @unit_price           = @config[:unit_price]
        @date_purchased       = @config[:date_purchased]
        @is_parent            = @config[:is_parent]
        @parent_id            = @config[:parent_id]
        @item_type            = @config[:item_type]
        @supplier_ids         = @config[:supplier_ids]
        @data                 = @config[:data]
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
          brand_id:             @brand_id,
          model:                @model,
          unit_price:           @unit_price,
          date_purchased:       @date_purchased,
          is_parent:            @is_parent,
          parent_id:            @parent_id,
          item_type:            @item_type,
          data:                 @data
        )
        item.supplier_ids = @supplier_ids if @supplier_ids.present?
        item.save!
        item
      end
    end
  end
end