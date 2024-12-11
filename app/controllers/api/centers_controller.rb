module Api
  class CentersController < ::Api::FrontController
    before_action :authenticate_user!
    before_action :authorize_admin!, only: [:update_coordinates]

    def update_coordinates
      lat     = params[:lat].to_f
      lon     = params[:lon].to_f
      center  = Center.find_by_id(params[:id])

      cmd = ::Centers::ValidateUpdateCoordinates.new(
        lat: lat,
        lon: lon,
        center: center
      )

      cmd.execute!

      if cmd.errors.any?
        render json: { errors: cmd.errors }, status: :unprocessable_entity
      else
        center.update!(
          lat: lat,
          lon: lon
        )

        render json: { message: "ok" }
      end
    end
  end
end
