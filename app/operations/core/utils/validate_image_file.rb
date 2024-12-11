module Core
  module Utils
    class ValidateImageFile < ::Core::Validator
      VALID_IMAGE_MIME_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png"
      ]

      def initialize(file:, valid_file_size: 2.0)
        super()

        @file             = file
        @valid_file_size  = valid_file_size

        @payload = {
          file: []
        }
      end

      def execute!
        if @file.blank?
          @payload[:file] << "required"
        else
          tempfile  = @file.tempfile
          file_size = File.size(tempfile).to_f / 2**20 # in MB
          mime_type = Marcel::MimeType.for tempfile

          if file_size > @valid_file_size
            @payload[:file] << "too large (2MB limit)"
          end

          if not VALID_IMAGE_MIME_TYPES.include?(mime_type)
            @payload[:file] << "invalid format"
          end
        end

        count_errors!

        @payload
      end
    end
  end
end
