require 'rails_helper'

RSpec.describe 'Fetch User Branches' do
  include ApiHelpers

  let(:user) { FactoryBot.create(:user, roles: ['MIS'], username: 'admin') }
  let(:branch) { FactoryBot.create(:branch) }
  let(:user_branch) { FactoryBot.create(:user_branch, user: user, branch: branch) }
  let(:oas_user) { FactoryBot.create(:user, roles: ['OAS'], username: 'oas') }
  let(:valid_user_headers) { build_jwt_header(user.generate_jwt) }
  let(:oas_user_headers) { build_jwt_header(oas_user.generate_jwt) }
  let(:api_url) { "/api/v3/user_branches" }

  describe 'POST /api/v3/user_branches/:id/fetch', type: :request do
    context 'invalid calls' do
      it 'fails if user is not logged in' do
        get "#{api_url}/#{user.id}/fetch", params: {}

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:forbidden)
      end

      it 'fails if user is not MIS' do
        get "#{api_url}/#{user.id}/fetch", headers: oas_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unauthorized)
      end

      it 'fails if not found' do
        get "#{api_url}/non-existent/fetch", headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'valid calls' do
      it 'succeeds to fetch user_branches' do
        get "#{api_url}/#{user.id}/fetch", headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
