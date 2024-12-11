require 'rails_helper'

RSpec.describe 'Toggle User Branch' do
  include ApiHelpers

  let(:user) { FactoryBot.create(:user, roles: ['MIS'], username: 'admin') }
  let(:branch) { FactoryBot.create(:branch) }
  let(:user_branch) { FactoryBot.create(:user_branch, user: user, branch: branch) }
  let(:oas_user) { FactoryBot.create(:user, roles: ['OAS'], username: 'oas') }
  let(:valid_user_headers) { build_jwt_header(user.generate_jwt) }
  let(:oas_user_headers) { build_jwt_header(oas_user.generate_jwt) }
  let(:api_url) { '/api/v3/user_branches/toggle' }

  describe 'POST /api/v3/user_branches/toggle', type: :request do
    context 'invalid calls' do
      it 'fails if user is not logged in' do
        post api_url, params: {}

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:forbidden)
      end

      it 'fails if user is not MIS' do
        post api_url, params: {}, headers: oas_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unauthorized)
      end

      it 'fails if no parameters passed' do
        post api_url, params: {}, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)

        # Required fields
        expect(payload['id'][0]).to eq('required')
      end

      it 'fails if not found' do
        params = {
          id: 'non-existent'
        }

        post api_url, params: params, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'valid calls' do
      it 'succeeds to toggle a user_branch' do
        params = {
          id: user_branch.id
        }

        post api_url, params: params, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)

        _user_branch = UserBranch.find(user_branch.id)

        expect(_user_branch.active).to eq(false)

        post api_url, params: params, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)

        _user_branch = UserBranch.find(user_branch.id)

        expect(_user_branch.active).to eq(true)
      end
    end
  end
end
