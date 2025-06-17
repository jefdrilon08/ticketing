module Api
  module V1
    module Administration
      class BrandsController < ApiController
        before_action :authenticate_user!

        def create
          config = brands_params.to_h
          errors = ::Administration::Brands::ValidateCreate.new(config: config).execute!
          if errors[:messages].any?
            return render json: { status: "error", messages: errors[:full_messages] }, status: 422
          end
          service = ::Administration::Brands::AddBrands.new(config: config)
          brands   = service.execute!
          render json: { status: "success", message: "Brand Created", brands: brands }, status: 200
        rescue StandardError => e
          render json: { status: "error", messages: e.message }, status: 422
        end

        def update
          config = brands_params.to_h
          errors = ::Administration::Brands::ValidateCreate.new(config: config).execute!
          if errors[:messages].any?
            return render json: { status: "error", messages: errors[:full_messages] }, status: 422
          end
          service = ::Administration::Brands::Update.new(config: config)
          brands   = service.execute!
          render json: { status: "success", message: "Brand Updated", brands: brands }, status: 200
        rescue StandardError => e
          render json: { status: "error", messages: e.message }, status: 422
        end

        def delete
          config = { id: params[:id] }
          result = ::Administration::Brands::Delete.new(config: config).execute!
          render json: { status: "success", message: result[:message] }, status: 200
        rescue StandardError => e
          render json: { status: "error", messages: e.message }, status: 422
        end

        private

        def brands_params
          params.require(:brand).permit(:name, :code)
        end
      end
    end
  end
end
