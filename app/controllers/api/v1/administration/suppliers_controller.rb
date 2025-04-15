module Api
  module V1
    module Administration
      class SuppliersController < ApiController
        before_action :authenticate_user!

        def create
          config = suppliers_params.to_h
          errors = ::Administration::Suppliers::ValidateCreate.new(config: config).execute!
          if errors[:messages].any?
            return render json: { status: "error", messages: errors[:full_messages] }, status: 422
          end
          service = ::Administration::Suppliers::AddSuppliers.new(config: config)
          suppliers = service.execute!
          render json: { status: "success", message: "Supplier Created", suppliers: suppliers }, status: 200
        rescue StandardError => e
          render json: { status: "error", messages: e.message }, status: 422
        end

        def update
          config = suppliers_params.to_h
          errors = ::Administration::Suppliers::ValidateCreate.new(config: config).execute!
          if errors[:messages].any?
            return render json: { status: "error", messages: errors[:full_messages] }, status: 422
          end
          service = ::Administration::Suppliers::Update.new(config: config)
          suppliers = service.execute!
          render json: { status: "success", message: "Supplier Updated", suppliers: suppliers }, status: 200
        rescue StandardError => e
          render json: { status: "error", messages: e.message }, status: 422
        end

        def delete
          config = { id: params[:id] }
          service = ::Administration::Suppliers::Delete.new(config: config)
          result = service.execute!
          render json: { status: "success", message: result[:message] }, status: 200
        rescue StandardError => e
          render json: { status: "error", messages: e.message }, status: 422
        end

        private

        def suppliers_params
          params.permit(
            :id,
            :code,
            :name,
            :status,
            :authenticity_token,
            :contact_person,
            :contact_number,
            :address
          )
        end
      end
    end
  end
end
