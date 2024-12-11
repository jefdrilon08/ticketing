require 'rails_helper'

RSpec.describe 'Members Login' do
  let(:member) { FactoryBot.create(:member) }
  let(:api_url) { '/api/members/login' }
  let(:valid_member) {
    FactoryBot.create(
      :member,
      status: 'active'
    )
  }

  describe "POST /api/members/login", type: :request do
    context 'invalid calls' do
      it 'returns error on no parameters passed' do
        post api_url

        payload = JSON.parse(response.body)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(payload['username']).to eq(['username required'])
        expect(payload['password']).to eq(['password required'])
      end

      it 'returns error on no user found' do
        invalid_username = 'test'
        invalid_password = 'test'

        post api_url, params: { username: invalid_username, password: invalid_password }

        expect(response).to have_http_status(:unprocessable_entity)

        payload = JSON.parse(response.body)

        expect(payload['username']).to eq(['user not found'])
      end

      it 'returns error on invalid status' do
        post api_url, params: { username: member.username, password: 'password' }

        expect(response).to have_http_status(:unprocessable_entity)

        payload = JSON.parse(response.body)

        expect(payload['username']).to eq(['invalid status'])
      end

      it 'returns error on invalid password' do
        invalid_password = 'test'

        post api_url, params: { username: member.username, password: invalid_password }

        expect(response).to have_http_status(:unprocessable_entity)

        payload = JSON.parse(response.body)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(payload['password']).to eq(['invalid password'])
      end
    end

    context 'valid calls' do
      it 'returns success' do
        valid_member.update!(status: 'active')
        post api_url, params: { username: valid_member.username, password: valid_member.password }

        payload = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
      end
    end
  end
end
