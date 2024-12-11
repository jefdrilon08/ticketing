require 'rails_helper'

RSpec.describe 'Index Users' do
  include ApiHelpers

  let(:user) { FactoryBot.create(:user, roles: ['MIS'], username: 'admin') }
  let(:oas_user) { FactoryBot.create(:user, roles: ['OAS'], username: 'oas') }
  let(:valid_user_headers) { build_jwt_header(user.generate_jwt) }
  let(:oas_user_headers) { build_jwt_header(oas_user.generate_jwt) }
  let(:api_url) { '/api/v3/users' }

  describe 'GET /api/v3/users', type: :request do
    context 'invalid calls' do
      it 'fails if user is not logged in' do
        get api_url, params: {}

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:forbidden)
      end

      it 'fails if user is not MIS' do
        get api_url, params: {}, headers: oas_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'valid calls' do
      it 'returns users' do
        get api_url, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
