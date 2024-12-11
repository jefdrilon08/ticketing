web: bundle exec puma -C config/puma.rb
worker: bundle exec sidekiq -C config/sidekiq.yml
worker_accounting: bundle exec sidekiq -C config/sidekiq-accounting.yml
css: yarn build:css --watch
js: yarn build:js
