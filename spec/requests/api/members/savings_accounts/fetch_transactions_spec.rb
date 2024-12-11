require 'rails_helper'

RSpec.describe 'Fetch More Transactions' do
  include ApiHelpers

  let (:member) { FactoryBot.create(:member, status: 'active') }
  let (:other_member) { FactoryBot.create(:member, status: 'active') }
  let (:inactive_member) { FactoryBot.create(:member, status: 'pending') }
  let (:api_url) { "/api/members/savings_accounts" }
  let (:valid_member_headers) { build_jwt_header(member.generate_jwt) }
  let (:other_member_headers) { build_jwt_header(other_member.generate_jwt) }
  let (:inactive_member_headers) { build_jwt_header(inactive_member.generate_jwt) }
  let (:member_account) { FactoryBot.create(:member_account, member: member) }
  let (:inactive_member_account) { FactoryBot.create(:member_account, member: inactive_member) }

  describe "GET /api/members/savings_accounts/:id/transactions", type: :request do
    context 'invalid calls' do
      it 'fails if member is not logged in' do
        get "#{api_url}/#{member_account.id}/transactions"

        expect(response).to have_http_status(:forbidden)
      end

      it 'fails if member is not active' do
        get "#{api_url}/#{inactive_member_account.id}/transactions", headers: inactive_member_headers

        expect(response).to have_http_status(:unauthorized)
      end

      it 'fails if member does not own account' do
        get "#{api_url}/#{member_account.id}/transactions", headers: other_member_headers

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'valid calls' do
      it 'succeeds to return dashboard data' do
        get "#{api_url}/#{member_account.id}/transactions", headers: valid_member_headers

        expect(response).to have_http_status(:ok)
      end
    end
  end
end
