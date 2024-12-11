require 'rails_helper'

RSpec.describe 'Import Members into System' do
  include ApiHelpers

  let(:user) { FactoryBot.create(:user, roles: ['MIS'], username: 'admin', is_verified: true) }
  let(:oas_user) { FactoryBot.create(:user, roles: ['OAS'], username: 'oas', is_verified: true) }
  let(:valid_user_headers) { build_jwt_header(user.generate_jwt) }
  let(:oas_user_headers) { build_jwt_header(oas_user.generate_jwt) }
  let(:api_url) { '/api/v3/members/import_members' }
  let(:branch) { FactoryBot.create(:branch) }

  describe "POST /api/v3/members/import_members", type: :request do
    context 'invalid calls' do
      it 'fails if user is not logged in' do
        post api_url

        expect(response).to have_http_status(:forbidden)
      end

      it 'fails if user is not MIS' do
        post api_url, headers: oas_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unauthorized)
      end

      it 'fails branch_id is not present in either one of the objects in data' do
        params = {
          data: [
            { branch_id: "" },
            { branch_id: branch.id },
            { branch_id: "" }
          ]
        }

        post api_url, params: params, headers: valid_user_headers
        expect(response).to have_http_status(:unprocessable_entity)

        payload = JSON.parse(response.body)
        expect(payload['data'][0]).to eq('index 0 has no branch_id')
        expect(payload['data'][1]).to eq('index 2 has no branch_id')
      end
    end

    context 'valid calls' do
    end
  end
end
