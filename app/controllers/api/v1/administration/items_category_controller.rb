module Api
  module V1
    module Administration
      class ItemsCategoryController < ApiController
        before_action :authenticate_user!

        def create

          config = items_category_params.to_h
          errors = ::Administration::ItemsCategory::ValidateCreate.new(config: config).execute!
          if errors[:messages].any?
            return render json: { status: "error", messages: errors[:full_messages] }, status: 422
          end
          service = ::Administration::ItemsCategory::AddItemsCategory.new(config: config)
          items_category = service.execute!
          render json: { status: "success", message: "Item Category Created", items_category: items_category }, status: 200
        rescue StandardError => e
          render json: { status: "error", messages: e.message }, status: 422
        end

        def update
          config = items_category_params.to_h
          errors = ::Administration::ItemsCategory::ValidateCreate.new(config: config).execute!
          if errors[:messages].any?
            return render json: { status: "error", messages: errors[:full_messages] }, status: 422
          end
          service = ::Administration::ItemsCategory::Update.new(config: config)
          items_category = service.execute!
          render json: { status: "success", message: "Items Category Updated", items_category: items_category }, status: 200
        rescue StandardError => e
          render json: { status: "error", messages: e.message }, status: 422
        end

        def delete
          config = { id: params[:id] }
          service = ::Administration::ItemsCategory::Delete.new(config: config)
          result = service.execute!
          render json: { status: "success", message: result[:message] }, status: 200
        rescue StandardError => e
          render json: { status: "error", messages: e.message }, status: 422
        end

        private

        def items_category_params
          params.permit(:id, :code, :name, :status, :authenticity_token)
        end
      end
    end
  end
end
