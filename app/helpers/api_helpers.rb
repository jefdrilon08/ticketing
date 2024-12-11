module ApiHelpers
  def build_jwt_header(token)
    { 'Authorization': "Bearer #{token}" }
  end
  
  def generate_password_hash(password)
    User.new(password: password).encrypted_password
  end

  def decode_jwt(token)
    JWT.decode(token, Rails.application.secret_key_base)
  end
end
