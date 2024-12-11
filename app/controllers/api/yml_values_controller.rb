module Api
  class YmlValuesController < ActionController::API
      def production_values
            development_data = YAML.load_file('config/settings/production.yml')
            render json: development_data["activate_microinsurance"]
      end
  end
end

