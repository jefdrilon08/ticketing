class App
  def self.name
    "KOINS"
  end

  def self.pipeline
    APP_PIPELINE
  end

  def self.production?
    APP_PIPELINE == "production"
  end
end
