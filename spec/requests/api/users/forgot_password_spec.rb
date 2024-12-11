require 'rails_helper'

RSpec.describe 'Create a User' do
  include ApiHelpers

  let(:user) { FactoryBot.create(:user, roles: ['MIS'], username: 'admin') }
  let(:api_url) { '/api/forgot_password' }

  describe 'POST /api/forgot_password' do
    context 'invalid calls' do
      it 'fails if no parameters are passed' do
        post api_url, params: {}

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)

        expect(payload['email'][0]).to eq('required')
      end

      it 'fails on invalid format' do
        post api_url, params: { email: 'invalid-format' }

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)

        expect(payload['email'][0]).to eq('invalid format')
      end

      it 'fails user not found' do
        post api_url, params: { email: 'non_existent@email.com' }

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)

        expect(payload['email'][0]).to eq('user not found')
      end
    end

    context 'valid calls' do
    end
  end
end
