module Utils
  class BackupDatabase
    def initialize(config:)
      @config = config

      @pw       = ::ActiveRecord::Base.connection_db_config.configuration_hash[:password]
      @host     = ::ActiveRecord::Base.connection_db_config.configuration_hash[:host]
      @username = ::ActiveRecord::Base.connection_db_config.configuration_hash[:username]
      @db       = ::ActiveRecord::Base.connection_db_config.configuration_hash[:database]

      @destination_file = @config[:destination_file]
    end

    def execute!
      cmd = "PGPASSWORD=#{@pw} pg_dump --host #{@host} --username #{@username} --verbose --clean --no-owner --no-acl --format=c #{@db} > #{@destination_file}"
      `#{cmd}`
    end
  end
end
