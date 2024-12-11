require 'rails_helper'

RSpec.describe 'Update User' do
  include ApiHelpers

  let(:user) { FactoryBot.create(:user, roles: ['MIS'], username: 'admin') }
  let(:oas_user) { FactoryBot.create(:user, roles: ['OAS'], username: 'oas') }
  let(:valid_user_headers) { build_jwt_header(user.generate_jwt) }
  let(:oas_user_headers) { build_jwt_header(oas_user.generate_jwt) }
  let(:invalid_file) { fixture_file_upload(File.new(File.join(::Rails.root.to_s, "/test/fixtures/files", "test.pdf"))) }
  let(:picture_file) { fixture_file_upload(File.new(File.join(::Rails.root.to_s, "/test/fixtures/files", "pic.jpg"))) }
  let(:api_url) { '/api/v3/users' }

  describe 'PUT /api/v3/users/:id', type: :request do
    context 'invalid calls' do
      it 'fails if user is not logged in' do
        put "#{api_url}/#{user.id}", params: {}

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:forbidden)
      end

      it 'fails if user is not MIS' do
        put "#{api_url}/#{user.id}", params: {}, headers: oas_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unauthorized)
      end

      it 'fails if passwords do not match' do
        params = {
          password: 'a',
          password_confirmation: 'b'
        }

        put "#{api_url}/#{user.id}", params: params, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(payload['password'][0]).to eq('passwords do not match')
        expect(payload['password_confirmation'][0]).to eq('passwords do not match')
      end

      it 'fails for user not found' do
        put "#{api_url}/non-existent", params: {}, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:not_found)
      end

      it 'fails for taken fields' do
        params = {
          identification_number: oas_user.identification_number,
          username: oas_user.username,
          email: oas_user.email
        }

        put "#{api_url}/#{user.id}", params: params, headers: valid_user_headers

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

        put "#{api_url}/#{user.id}", params: params, headers: valid_user_headers

        payload = JSON.parse(response.body)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(payload['profile_picture'][0]).to eq('invalid format')
        expect(payload['email'][0]).to eq('invalid format')
      end
    end

    context 'valid calls' do
      it 'succeeds on updating a user' do
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

        put "#{api_url}/#{user.id}", params: params, headers: valid_user_headers

        payload = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)

        updated_user = User.find(user.id)
        expect(updated_user.username).to eq(params[:username])
        expect(updated_user.identification_number).to eq(params[:identification_number])
        expect(updated_user.email).to eq(params[:email])
        expect(updated_user.first_name).to eq(params[:first_name])
        expect(updated_user.last_name).to eq(params[:last_name])
      end
    end
  end
end
