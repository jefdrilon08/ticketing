require 'rails_helper'

RSpec.describe 'Apply for Loan Online' do
  include ApiHelpers

  let (:member) { FactoryBot.create(:member, status: 'active') }
  let (:co_maker_member) { FactoryBot.create(:member, status: 'actice', center: member.center) }
  let (:invalid_member) { FactoryBot.create(:member) }
  let (:co_maker_member) { FactoryBot.create(:member, status: 'active', branch: member.branch, center: member.center) }
  let (:api_url) { "/api/members/loans" }
  let (:valid_member_headers) { build_jwt_header(member.generate_jwt) }
  let (:invalid_member_headers) { build_jwt_header(invalid_member.generate_jwt) }
  let (:loan_product) { FactoryBot.create(:loan_product) }

  describe "POST /api/members/loans", type: :request do
    context 'invalid calls' do
      it 'fails if member is not logged in' do
        post "#{api_url}"

        expect(response).to have_http_status(:forbidden)
      end

      it 'fails if member is not active' do
        post "#{api_url}", headers: invalid_member_headers

        expect(response).to have_http_status(:unauthorized)
      end

      it 'fails if parameters are missing' do
        post "#{api_url}", headers: valid_member_headers

        expect(response).to have_http_status(:unprocessable_entity)

        payload = JSON.parse(response.body)

        expect(payload['amount']).to eq(['required'])
        expect(payload['term']).to eq(['required'])
        expect(payload['num_installments']).to eq(['required'])
        expect(payload['loan_product_id']).to eq(['required'])
        expect(payload['co_maker_first_name']).to eq(['required'])
        expect(payload['co_maker_last_name']).to eq(['required'])
        expect(payload['co_maker_member_id']).to eq(['required'])
      end

      it 'fails if member has an existing pending loan application' do
        existing_loan_application = FactoryBot.create(
          :loan_application,
          member: member,
          co_maker_member: co_maker_member,
          co_maker_first_name: Faker::Name.first_name,
          co_maker_last_name: Faker::Name.last_name,
        )

        post "#{api_url}", params: {}, headers: valid_member_headers

        expect(response).to have_http_status(:unprocessable_entity)

        payload = JSON.parse(response.body)

        expect(payload['loan_application']).to eq(['pending application'])
      end

      it 'fails if amount is less than minimum of loan product' do
        params = {
          loan_product_id:  loan_product.id,
          amount:           loan_product.min_loan_amount - 1
        }

        post "#{api_url}", params: params, headers: valid_member_headers

        expect(response).to have_http_status(:unprocessable_entity)

        payload = JSON.parse(response.body)

        expect(payload['amount']).to eq(['invalid amount'])
      end

      it 'fails if amount is more than max of loan product' do
        params = {
          loan_product_id:  loan_product.id,
          amount:           loan_product.max_loan_amount + 1
        }

        post "#{api_url}", params: params, headers: valid_member_headers

        expect(response).to have_http_status(:unprocessable_entity)

        payload = JSON.parse(response.body)

        expect(payload['amount']).to eq(['invalid amount'])
      end
    end

    context 'valid calls' do
      it 'succeeds to submit a loan application' do
        initial_count = LoanApplication.count
        expected_count = initial_count + 1

        valid_params = {
          loan_product_id:      loan_product.id,
          num_installments:     25,
          term:                 'weekly',
          amount:               5000.00,
          date_applied:         Date.today.strftime("%Y-%m-%d"),
          co_maker_first_name:  Faker::Name.first_name,
          co_maker_last_name:   Faker::Name.last_name,
          co_maker_member_id:   co_maker_member.id
        }

        post "#{api_url}", params: valid_params, headers: valid_member_headers

        expect(response).to have_http_status(:ok)

        current_count = LoanApplication.count

        expect(current_count).to eq(expected_count)

        payload = JSON.parse(response.body)

        # Expect to have reference number
        expect(payload['reference_number']).not_to eq(nil)
      end
    end
  end
end
