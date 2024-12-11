class ReadOnlyUserBranch < UserBranch
  establish_connection(ENV['FOLLOWER_READ_ONLY_DATABASE_URL'])
end
