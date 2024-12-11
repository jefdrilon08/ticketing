require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Koins
  class Application < Rails::Application
    config.load_defaults 7.0 
    config.autoloader = :classic

    # Configuration for the application, engines, and railties goes here.
    #   
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #   
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
    #config.eager_load_paths += Dir["#{config.root}/lib/**/"]
    #config.autoload_paths << "#{config.root}/lib"
    #config.eager_load_paths << "#{config.root}/lib"

    config.time_zone = 'Asia/Manila'
    config.active_record.default_timezone = :local # Or :utc

    # Use sidekiq
    config.active_job.queue_adapter = :sidekiq

    config.generators do |g| 
      g.orm :active_record, primary_key_type: :uuid
    end 

    # ActionCable
    config.action_cable.mount_path = '/websocket'

    #config.action_view.raise_on_missing_translations = true
    config.action_controller.asset_host = "#{(ENV['APP_PIPELINE'] == 'staging' || ENV['APP_PIPELINE'] == 'production') ? 'https' : 'http'}://#{ENV['APP_HOST']}"
    config.active_record.dump_schemas = :all
    config.action_controller.forgery_protection_origin_check = false

    # Set action_dispatch.show_exceptions to :none to avoid deprecation Warning (Rails 7)
    config.action_dispatch.show_exceptions = :none
  end
end
