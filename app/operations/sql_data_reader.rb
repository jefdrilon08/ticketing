# https://stackoverflow.com/questions/46411130/rails-activerecord-raw-sql-read-data-without-loading-everything-into-memory-wit
# Summary: Read sql result in batches so as not to load everything in memory

class SqlDataReader
  attr_accessor :sql,
                :batch_size,
                :max_records

  def initialize(sql, batch_size, max_records = 100000)
    self.sql          = sql
    self.batch_size   = batch_size
    self.max_records  = max_records
  end

  def read
    offset = 0

    while !(results = ActiveRecord::Base.connection.exec_query(query(offset))).empty? && offset < max_records do
      
      records = results.to_hash

      offset += records.length

      results.to_hash.each do |record|
        yield record
      end
    end
  end

  def query(offset)
    sql + " LIMIT #{batch_size} OFFSET #{offset}"
  end
end
