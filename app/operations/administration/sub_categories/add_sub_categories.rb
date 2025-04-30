module Administration
  module SubCategories
    class AddSubCategories
      def initialize(config:)
        @config = config
        @name = @config[:name]
        @code = @config[:code]
        @category_id = @config[:category_id]
      end

      def execute!
        create_sub_category
      end

      private

      def create_sub_category
        # Ensure a unique subcategory name/code or any additional validation
        sub_category = ::SubCategory.new(
          name: @name,
          code: @code,
          category_id: @category_id
        )
        sub_category.save!
        sub_category
      rescue StandardError => e
        # Handle any potential errors during saving
        raise "Failed to create subcategory: #{e.message}"
      end
    end
  end
end
