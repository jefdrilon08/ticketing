require 'rails_helper'

RSpec.describe 'Show User' do
  include ApiHelpers

  let(:user) { FactoryBot.create(:user, roles: ['MIS'], username: 'admin') }
  let(:oas_user) { FactoryBot.create(:user, roles: ['OAS'], username: 'oas') }
  let(:valid_user_headers) { build_jwt_header(user.generate_jwt) }
  let(:oas_user_headers) { build_jwt_header(oas_user.generate_jwt) }
  let(:api_url) { '/api/v3/users' }

  describe 'GET /api/v3/users/:id', type: :request do
    context 'invalid calls' do
      it 'fails if user is not logged in' do
        get "#{api_url}/#{user.id}", params: {}

        expect(response).to have_http_status(:forbidden)
      end

      it 'fails if user is not MIS' do
        get "#{api_url}/#{user.id}", params: {}, headers: oas_user_headers

        expect(response).to have_http_status(:unauthorized)
      end

      it 'fails for user not found' do
        get "#{api_url}/non-existent", params: {}, headers: valid_user_headers

        expect(response).to have_http_status(:not_found)
      end
    end

    context 'valid calls' do
      it 'succeeds on returning a user' do
        get "#{api_url}/#{user.id}", params: {}, headers: valid_user_headers

        expect(response).to have_http_status(:ok)
      end
    end
  end
end
