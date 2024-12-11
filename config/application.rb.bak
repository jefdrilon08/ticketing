require_relative 'boot'

require 'rails/all'
require 'csv'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Koins
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    config.time_zone = 'Asia/Manila'
    config.active_record.default_timezone = :local # Or :utc

    # Use sidekiq
    config.active_job.queue_adapter = :sidekiq

    config.generators do |g|
      g.orm :active_record, primary_key_type: :uuid
    end

    # ActionCable
    config.action_cable.mount_path = '/websocket'

    config.action_view.raise_on_missing_translations = true

    config.action_controller.asset_host = "#{(ENV['APP_PIPELINE'] == 'staging' || ENV['APP_PIPELINE'] == 'production') ? 'https' : 'http'}://#{ENV['APP_HOST']}"
  end
end
