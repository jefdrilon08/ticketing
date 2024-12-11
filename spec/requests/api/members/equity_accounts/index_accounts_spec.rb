require 'rails_helper'

RSpec.describe 'Fetch Equity Accounts' do
  include ApiHelpers

  let (:member) { FactoryBot.create(:member, status: 'active') }
  let (:invalid_member) { FactoryBot.create(:member) }
  let (:api_url) { "/api/members/equity_accounts" }
  let (:valid_member_headers) { build_jwt_header(member.generate_jwt) }
  let (:invalid_member_headers) { build_jwt_header(invalid_member.generate_jwt) }

  describe "GET /api/members/equity_accounts", type: :request do
    context 'invalid calls' do
      it 'fails if member is not logged in' do
        get "#{api_url}"

        expect(response).to have_http_status(:forbidden)
      end

      it 'fails if member is not active' do
        get "#{api_url}", headers: invalid_member_headers

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'valid calls' do
      it 'succeeds to return dashboard data' do
        get "#{api_url}", headers: valid_member_headers

        expect(response).to have_http_status(:ok)
      end
    end
  end
end
