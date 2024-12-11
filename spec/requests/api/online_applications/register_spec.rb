require 'rails_helper'

RSpec.describe 'Register' do
  include ApiHelpers

  let (:api_url) { '/api/register' }
  let (:online_application) { FactoryBot.create(:online_application) }

  describe "POST /register" do
    context 'invalid calls' do
      it 'returns error on no parameters passed' do
        post api_url

        expect(response).to have_http_status(:unprocessable_entity)

        payload = JSON.parse(response.body)

        expect(payload['first_name']).to eq(['required'])
        expect(payload['last_name']).to eq(['required'])
        expect(payload['gender']).to eq(['required'])
        expect(payload['date_of_birth']).to eq(['required'])
        expect(payload['email']).to eq(['required'])
        expect(payload['mobile_number']).to eq(['required'])
        expect(payload['address_region']).to eq(['required'])
        expect(payload['address_province']).to eq(['required'])
        expect(payload['address_city']).to eq(['required'])
        expect(payload['address_district']).to eq(['required'])
        expect(payload['address_street']).to eq(['required'])
        #expect(payload['files']).to eq(['required'])
        #expect(payload['profile_picture']).to eq(['required'])
        expect(payload['reason_for_joining']).to eq(['required'])
        expect(payload['sss_number']).to eq(['required'])
        expect(payload['tin_number']).to eq(['required'])
        expect(payload['pag_ibig_number']).to eq(['required'])
        expect(payload['phil_health_number']).to eq(['required'])
        expect(payload['branch_id']).to eq(['required'])
        expect(payload['center_id']).to eq(['required'])
      end

      it 'returns error on duplicate application' do
        online_application

        invalid_params = {
          email: online_application.email,
          mobile_number: online_application.mobile_number
        }

        post api_url, params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)

        payload = JSON.parse(response.body)

        expect(payload['email']).to eq(['duplicate value'])
        expect(payload['mobile_number']).to eq(['duplicate value'])
      end

      it 'returns error on invalid values' do
        invalid_params = {
          email: 'invalid-value',
          gender: 'invalid-value',
          date_of_birth: 'invalid-value',
          mobile_number: 'invalid-value',
          sss_number: 'invalid-value',
          tin_number: 'invalid-value',
          pag_ibig_number: 'invalid-value',
          phil_health_number: 'invalid-value'
        }

        post api_url, params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)

        payload = JSON.parse(response.body)

        expect(payload['email']).to eq(['invalid value'])
        expect(payload['gender']).to eq(['invalid value'])
        expect(payload['date_of_birth']).to eq(['invalid value'])
        expect(payload['mobile_number']).to eq(['invalid value'])
        expect(payload['sss_number']).to eq(['invalid value'])
        expect(payload['tin_number']).to eq(['invalid value'])
        expect(payload['pag_ibig_number']).to eq(['invalid value'])
        expect(payload['phil_health_number']).to eq(['invalid value'])
      end
    end

    context 'valid calls' do
      it 'Successfully submits an online application' do
        test_branch = FactoryBot.create(:branch)
        test_center = FactoryBot.create(:center, branch: test_branch)

        params = {
          email:              Faker::Internet.email,
          gender:             'Female',
          date_of_birth:      Date.today,
          first_name:         Faker::Name.first_name,
          middle_name:        Faker::Name.middle_name,
          last_name:          Faker::Name.last_name,
          branch_id:          test_branch.id,
          center_id:          test_center.id,
          mobile_number:      "+639#{Faker::Number.unique.number(digits: 9).to_s}",
          address_region:     Faker::Address.state,
          address_province:   Faker::Address.state,
          address_district:   Faker::Address.state,
          address_city:       Faker::Address.city,
          address_street:     Faker::Address.street_address,
          reason_for_joining: 'Test Reason',
          sss_number:         '1111111111',
          tin_number:         '111111111111',
          pag_ibig_number:    '111111111111',
          phil_health_number: '111111111111'
        }

        post api_url, params: params

        payload = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)

        expect(OnlineApplication.count).to eq(1)
      end
    end
  end
end
