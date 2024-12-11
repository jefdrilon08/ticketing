# TICKETING

Microfinance and Microinsurance management system.

## Software Requirements

* Ruby on Rails version 7.x or higher
* PostgreSQL version 14.x or higher
* NodeJS version 16.x or higher with webpack

## First Time Setup

1. Acquire the source code from `https://github.com`.

```
git clone git@github.com:cloudband-solutions/koins.git
```

2. TICKETING uses `dotenv-rails` gem to manage environment variables. Copy the `.env.dist` file to `.env` and make sure to change the values according to your environment

3. Setup the database and migrate the latest schema
```
bundle exec rails db:setup && bundle exec rails db:migrate
```

4. Install ruby and javascript dependencies:

```
bundle install
yarn install
```

5. As of **Rails 7**, the system uses `postcss` for compiling css and `esbuild` for javascript. Scripts to perform building is `package.json`. To run all components, use the `Profile` which can be easily ran using the following command:

```
./bin/dev
```

This will run the following (see `Procfile` for reference):

* `puma` application server
* sidekiq for operations
* sidekiq for accounting
* css compiler
* js compiler

## Using Rails Credentials

As of **Rails 7.2**, `Rails.application.secret_key_base` will be deprecated in favor of credentials. In a nutshell, we will need to generate a `*.enc` file for each environment with `secret_key_base` value stored in it. To do so, execute the following:

```
EDITOR="vim" rails credentials:edit --environment=development
```

Change the value of `EDITOR` to your code editor of choice. Change the value of `environment` to the target environment of choice. You will need to do this to make sure you can run tests. This will generate a `*.key` value within `config/credentials` which is ignored by git making it unique for every deployment.

More info here [https://guides.rubyonrails.org/security.html](https://guides.rubyonrails.org/security.html).

## Scripts

* nginx systemd service: `scripts/nginx.service`

To initialize nginx via systemd:

```
sudo cp scripts/nginx.service /lib/systemd/system/nginx.service
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Notes

### Create PostgreSQL user

1. Create a new user

```
sudo -u postgres createuser developer -P
```

2. Login to postgres

```
sudo su - postgres && psql
```

3. Alter role to Superuser

```
ALTER USER developer WITH SUPERUSER;
```

### Install Latest Redis on Ubuntu

1. Uninstall default version of redis-server:

```shell
sudo systemctl stop redis-server
sudo systemctl disable redis-server
sudo apt purge redis-server
```

2. Use following tutorial:

[Click here](https://redis.io/docs/getting-started/installation/install-redis-on-linux/)

3. Turn off protected mode (production)

From the redis server, enter the cli and issue the following command:

```
CONFIG SET protected-mode no
```

## Running Tests

Make sure that you have the `retest` gem locally installed (`gem install retest`). To run all tests:

```
retest 'bundle exec rspec'
```
# ticketing
