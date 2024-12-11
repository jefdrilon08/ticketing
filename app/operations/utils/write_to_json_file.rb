module Utils
  class WriteToJsonFile
    def initialize(config:)
      @filename   = config[:filename]
      @path       = config[:path]
      @data       = config[:data]
      @full_path  = "#{@path}/#{@filename}"
    end

    def execute!
      File.open(@full_path, "w") do |f|
        f.write(JSON.pretty_generate(@data).force_encoding("UTF-8"))
      end

      @full_path
    end
  end
end
