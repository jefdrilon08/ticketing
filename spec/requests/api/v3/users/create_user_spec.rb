require 'rails_helper'

RSpec.describe 'Create a User' do
  include ApiHelpers

  let(:user) { FactoryBot.create(:user, roles: ['MIS'], username: 'admin') }
  let(:oas_user) { FactoryBot.create(:user, roles: ['OAS'], username: 'oas') }
  let(:valid_user_headers) { build_jwt_header(user.generate_jwt) }
  let(:oas_user_headers) { build_jwt_header(oas_user.generate_jwt) }
  let(:invalid_file) { fixture_file_upload(File.new(File.join(::Rails.root.to_s, "/test/fixtures/files", "test.pdf"))) }
  let(:picture_file) { fixture_file_upload(File.new(File.join(::Rails.root.to_s, "/test/fixtures/files", "pic.jpg"))) }
  let(:api_url) { '/api/v3/users' }

  describe 'POST /api/v3/users', type: :request do
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

      it 'fails on no parameters passed' do
        post api_url, params: {}, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)

        # Required fields
        expect(payload['email'][0]).to eq('required')
        expect(payload['username'][0]).to eq('required')
        expect(payload['first_name'][0]).to eq('required')
        expect(payload['last_name'][0]).to eq('required')
        expect(payload['identification_number'][0]).to eq('required')
        expect(payload['roles'][0]).to eq('required')
        expect(payload['password'][0]).to eq('required')
        expect(payload['password_confirmation'][0]).to eq('required')
      end

      it 'fails if passwords do not match' do
        params = {
          password: 'a',
          password_confirmation: 'b'
        }

        post api_url, params: params, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(payload['password'][0]).to eq('passwords do not match')
        expect(payload['password_confirmation'][0]).to eq('passwords do not match')
      end

      it 'fails for taken fields' do
        params = {
          identification_number: user.identification_number,
          username: user.username,
          email: user.email
        }

        post api_url, params: params, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(payload['identification_number'][0]).to eq('already taken')
        expect(payload['username'][0]).to eq('already taken')
        expect(payload['email'][0]).to eq('already taken')
      end

      it 'fails on invalid formats' do
        params = {
          profile_picture: invalid_file,
          email: 'invalid-format'
        }

        post api_url, params: params, headers: valid_user_headers

        payload = JSON.parse(response.body)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(payload['profile_picture'][0]).to eq('invalid format')
        expect(payload['email'][0]).to eq('invalid format')
      end
    end

    context 'valid calls' do
      it 'succeeds on creating a user' do
        user
        params = {
          identification_number: '11111111',
          username: 'new-user',
          password: 'password',
          password_confirmation: 'password',
          email: 'new_user@example.com',
          first_name: 'First',
          last_name: 'Last',
          roles: ['MIS'],
          profile_picture: picture_file
        }

        current_user_count = User.count
        post api_url, params: params, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(User.count).to eq(current_user_count + 1)
      end
    end
  end
end
