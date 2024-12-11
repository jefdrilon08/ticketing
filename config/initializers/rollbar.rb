Rollbar.configure do |config|
  config.access_token = ROLLBAR_ACCESS_TOKEN
  config.enabled = false if Rails.env.development? || Rails.env.test?
end
