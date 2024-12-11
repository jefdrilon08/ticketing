class ReportingDbCenter < Center
  establish_connection(ENV['FOLLOWER_READ_ONLY_REPORTING_DATABASE_URL'])
end
