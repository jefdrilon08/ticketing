module Api
  module V2
    class PublicController < ApiController
      def branches
        branches  = ReadOnlyBranch.where("is_main IS NULL OR is_main = 'f'").order("name ASC").map{ |o|
                      {
                        id: o.id,
                        name: o.name
                      }
                    }

        render json: { branches: branches }
      end

      def check_mobile_number
        mobile_number = params[:mobile_number]

        if mobile_number.blank?
          render json: { errors: ["mobile_number required"] }, status: 403
        elsif OnlineApplication.where.not(status: 'rejected').where(mobile_number: mobile_number).count > 0
          render json: { errors: ["mobile_number already taken"] }, status: 403
        else
          render json: { message: "ok" }
        end
      end

      def check_status
        reference_number = params[:reference_number]

        if reference_number.blank?
          render json: { errors: ["reference_number required"] }, status: 403
        else
          online_application = OnlineApplication.find_by_reference_number(reference_number)

          if online_application.blank?
            render json: { errors: ["online application not found"] }, status: 403
          else
            render json: { status: online_application.status }
          end
        end
      end

      def apply
        payload = JSON.parse(params[:payload]).with_indifferent_access

        config = {
          first_name:         payload[:first_name],
          middle_name:        payload[:middle_name],
          last_name:          payload[:last_name],
          gender:             payload[:gender],
          date_of_birth:      payload[:date_of_birth],
          civil_status:       payload[:civil_status],
          home_number:        payload[:home_number],
          mobile_number:      payload[:mobile_number],
          place_of_birth:     payload[:place_of_birth],
          religion:           payload[:religion],
          data:               payload[:data],
          branch_id:          payload[:branch_id],
          file_document:      params[:file_document],
          profile_picture:    params[:profile_picture],
          agreed_to_dp_terms: payload[:agreed_to_dp_terms]
        }

        validator = ::Public::ValidateOnlineApplication.new(
                      config: config
                    )

        validator.execute!

        if validator.errors[:full_messages].size > 0
          render json: { errors: validator.errors[:full_messages] }, status: 403
        else
          cmd = ::Public::SaveOnlineApplication.new(
                  config: config
                )

          cmd.execute!

          render json: { message: "ok", reference_number: cmd.online_application.reference_number }
        end
      end
    end
  end
end
