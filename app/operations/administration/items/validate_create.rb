module Administration
  module Items
    # This class validates the input data before creating a new item.
    class ValidateCreate
      def initialize(config:)
        @errors            = { messages: [] }
        @config            = config
        @id                = @config[:id]
        @name              = @config[:name]
        @description       = @config[:description]
        @status            = @config[:status]
        @unit              = @config[:unit]
        @items_category_id = @config[:items_category_id]
        @mr_number         = @config[:mr_number]
        @serial_number     = @config[:serial_number]
        @total_quantity    = @config[:total_quantity]
        @available_quantity = @config[:available_quantity]
      end

      def execute!
        validate_name          
        validate_status         
        validate_unit           
        validate_items_category 
        validate_mr_number      
        validate_serial_number  
        validate_quantities     

        return @errors if @errors[:messages].any?

        @errors[:full_messages] = @errors[:messages].map { |error| error[:message] }
        @errors
      end

      private

      def validate_name
        if @name.blank?
          @errors[:messages] << { key: "name", message: "Name cannot be blank." }
        elsif duplicate_name_exists?
          @errors[:messages] << { key: "name", message: "An item with the name '#{@name}' already exists." }
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

      def validate_mr_number
        if @mr_number.blank?
          @errors[:messages] << { key: "mr_number", message: "MR Number cannot be blank." }
        end
      end

      def validate_serial_number
        if @serial_number.blank?
          @errors[:messages] << { key: "serial_number", message: "Serial Number cannot be blank." }
        end
      end

      def validate_quantities
        if @total_quantity.blank? || @total_quantity.to_i < 0
          @errors[:messages] << { key: "total_quantity", message: "Total quantity must be a non-negative number." }
        end

        if @available_quantity.blank? || @available_quantity.to_i < 0
          @errors[:messages] << { key: "available_quantity", message: "Available quantity must be a non-negative number." }
        end

        if @total_quantity.present? && @available_quantity.present? && @available_quantity.to_i > @total_quantity.to_i
          @errors[:messages] << { key: "available_quantity", message: "Available quantity cannot exceed total quantity." }
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
