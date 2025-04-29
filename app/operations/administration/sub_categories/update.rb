module Administration
    module SubCategories
      class Update
        def initialize(config:)
          @config = config
          @items_category = ::ItemsCategory.find(config[:id])
          @code   = @config[:code]
          @name   = @config[:name]
          @category_id = @config[:category_id]
        end
  
        def execute!
          @sub_categories.update!(
            code:   @code,
            name:   @name,
            category_id: @category_id
          )
          @category_id
        end
      end
    end
  end
  