require 'rails_helper'

RSpec.describe 'Repayment Rates Show' do
  include ApiHelpers

  let(:user) { FactoryBot.create(:user, roles: ['MIS']) }
  let(:oas_user) { FactoryBot.create(:user, roles: ['OAS'], username: 'oas') }
  let(:branch) { FactoryBot.create(:branch) }
  let(:user_branch) { FactoryBot.create(:user_branch, branch: branch, user: user) }
  let(:valid_user_headers) { build_jwt_header(user.generate_jwt) }
  let(:oas_user_headers) { build_jwt_header(oas_user.generate_jwt) }
  let(:repayment_rate) { FactoryBot.create(:data_store, meta: { branch_id: branch.id, branch_name: branch.name, data_store_type: "REPAYMENT_RATES" }) }
  let(:api_url) { "/api/repayment_rates" }

  describe "GET /api/repayment_rates/:id", type: :request do
    context 'invalid calls' do
      it 'fails if user is not logged in' do
        get "#{api_url}/#{repayment_rate.id}"

        expect(response).to have_http_status(:forbidden)
      end

      it 'fails if record is not found' do
        user_branch
        get "#{api_url}/non-existent",  headers: valid_user_headers

        expect(response).to have_http_status(:not_found)
      end

      it 'fails if user does not own data' do
        user_branch
        get "#{api_url}/#{repayment_rate.id}", headers: oas_user_headers

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'valid calls' do
      it 'succeeds in returning a record' do
        user_branch
        get "#{api_url}/#{repayment_rate.id}", headers: valid_user_headers

        expect(response).to have_http_status(:ok)
      end
    end
  end
end
