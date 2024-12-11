require 'rails_helper'

RSpec.describe 'Delete User' do
  include ApiHelpers

  let(:user) { FactoryBot.create(:user, roles: ['MIS'], username: 'admin', identification_number: 'admin-12345') }
  let(:oas_user) { FactoryBot.create(:user, roles: ['OAS'], username: 'oas', identification_number: 'oas-12345') }
  let(:valid_user_headers) { build_jwt_header(user.generate_jwt) }
  let(:oas_user_headers) { build_jwt_header(oas_user.generate_jwt) }
  let(:api_url) { '/api/v3/users' }

  describe 'DELETE /api/v3/users/:id', type: :request do
    context 'invalid calls' do
      it 'fails if user is not logged in' do
        delete "#{api_url}/#{user.id}", params: {}

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:forbidden)
      end

      it 'fails if user is not MIS' do
        delete "#{api_url}/#{user.id}", params: {}, headers: oas_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unauthorized)
      end

      it 'fails for user not found' do
        delete "#{api_url}/non-existent", params: {}, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'valid calls' do
      it 'succeeds on returning a user' do
        user_id = user.id
        delete "#{api_url}/#{user_id}", params: {}, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)

        expect(User.find_by_id(user_id)).to eq(nil)
      end
    end
  end
end
