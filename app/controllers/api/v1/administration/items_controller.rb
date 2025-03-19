module Api
  module V1
    module Administration
      class ItemsController < ApplicationController
 
        def create
          errors = ::Administration::Items::ValidateCreate.new(config: item_params).execute!
          if errors[:messages].any?
            return render json: { status: "error", messages: errors[:full_messages] }, status: 422
          end
          service = ::Administration::Items::AddItems.new(config: item_params)
          item = service.execute!
          render json: { status: "success", item: item }
        rescue StandardError => e
          render json: { status: "error", messages: e.message }, status: 422
        end


        def update
          service = ::Administration::Items::Update.new(config: item_params)
          item = service.execute!
          render json: { status: "success", item: item }
        rescue StandardError => e
          render json: { status: "error", messages: e.message }, status: 422
        end

        def delete
          service = ::Administration::Items::Delete.new(config: { id: params[:id] })
          result = service.execute!
          render json: { status: "success", message: result[:message] }
        rescue StandardError => e
          render json: { status: "error", messages: e.message }, status: 422
        end

        private

        def item_params
          params.permit(:name, :description, :status, :unit, :id, :items_category_id, :authenticity_token)
        end
      end
    end
  end
end
