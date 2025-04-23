module Administration
    module Brands
      class Update
        def initialize(config:)
          @config          = config
          @brands  = ::Brand.find(config[:id])
          @code            = @config[:code]
          @name            = @config[:name]
          @item_id         = @config[:item_id]
        end
  
        def execute!
          @brands.update!(
            code:    @code,
            name:    @name,
            item_id: @item_id
          )
          @brands
        end
      end
    end
  end
  