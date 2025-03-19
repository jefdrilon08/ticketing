module Administration
  module Items
    class ValidateCreate
      def initialize(config:)
        @errors = { messages: [] }
        @config = config
        @id = @config[:id]
        @name = @config[:name]
        @description = @config[:description]
        @status = @config[:status]
        @unit = @config[:unit]
        @items_category_id = @config[:items_category_id]
      end

      def execute!
        validate_name
        validate_status
        validate_unit
        validate_items_category

        return @errors if @errors[:messages].any?

        @errors[:full_messages] = @errors[:messages].map { |error| error[:message] }
        @errors
      end

      private

      def validate_name
        if @name.blank?
          @errors[:messages] << { key: "name", message: "Name cannot be blank." }
        elsif duplicate_name_exists?
          @errors[:messages] << { key: "item", message: "An item with the name '#{@name}' already exists." }
        end
      end

      def validate_status
        if @status.blank?

          if @id.blank?
            @status = "Active"
          else
            @errors[:messages] << { key: "status", message: "Status cannot be blank." }
          end
        end
      end

      def validate_unit
        if @unit.blank?
          @errors[:messages] << { key: "unit", message: "Unit cannot be blank." }
        end
      end

      def validate_items_category
        if @items_category_id.blank?
          @errors[:messages] << { key: "items_category", message: "Items category must be selected." }
        end
      end

      def duplicate_name_exists?
        ::Item.where("LOWER(name) = ?", @name.to_s.downcase)
              .where.not(id: @id)
              .exists?
      end
    end
  end
end