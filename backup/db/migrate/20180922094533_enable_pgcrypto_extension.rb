class EnablePgcryptoExtension < ActiveRecord::Migration[5.2]
  
  def change
    connection.execute 'CREATE SCHEMA IF NOT EXISTS heroku_ext'
    enable_extension 'pgcrypto'
  end
end
