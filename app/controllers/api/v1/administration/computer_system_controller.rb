module Api
    module V1
      module Administration
        class ComputerSystemController < ApiController
          before_action :authenticate_user!
    
          def create 
              config = {
                  name:           params[:name],
                  description:    params[:description],
                  status:         params[:status]
              }
              # result = ::Administration::ComputerSystem::AddSystem.new(config: config).execute!
              # render json: { success: true, message: "success"}

              errors = ::Administration::ComputerSystem::ValidateCreate.new(config: config).execute!

              if errors[:messages].any?
                render json: errors, status: 400
              else
              result = ::Administration::ComputerSystem::AddSystem.new(config: config).execute!
              render json: { success: true, message: 'Computer System Created', status: 200 }
            end
          end
          
          def update
            config = {
              id: params[:id],
              name: params[:name],
              description: params[:description],
              status: params[:status]
            }
            # result  = ::Administration::ComputerSystem::Update.new(config:config).execute!
            # render json: {message: result}
            errors = ::Administration::ComputerSystem::ValidateUpdate.new(config: config).execute!

            if errors[:messages].any?
              render json: errors, status: 400
            else
            result  = ::Administration::ComputerSystem::Update.new(config:config).execute!
            render json: { success: true, message: 'Computer System Updated', status: 200 }
            end
          end

          def delete
            config = { id: params[:id] }
            begin
              result = ::Administration::ComputerSystem::Delete.new(config: config).execute!
              render json: { message: result[:message] }
            rescue => e
              render json: { error: e.message }, status: :not_found
            end
          end

        end
      end
    end
  end
  