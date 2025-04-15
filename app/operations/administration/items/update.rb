module Administration
  module Items
    class Update
      def initialize(config:)
        @config             = config
        @item               = ::Item.find(@config[:id])
        @name               = @config[:name]
        @description        = @config[:description]
        @status             = @config[:status]
        @unit               = @config[:unit]
        @items_category_id  = @config[:items_category_id].presence
        @parent_id          = @config[:parent_id]
        @is_parent          = ActiveModel::Type::Boolean.new.cast(@config[:is_parent])
      end

      def execute!
        @item.update!(
          name:               @name,
          description:        @description,
          status:             @status,
          unit:               @unit,
          items_category_id:  @items_category_id,
          parent_id:          @is_parent ? @parent_id : nil
        )
        @item
      end
    end
  end
end
