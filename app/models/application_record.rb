class ApplicationRecord < ActiveRecord::Base

    self.abstract_class = true

    attr_accessor :option

    before_save do
        if self.has_attribute?(:options)
            unless self.options_changed?
                self.options = self.option.to_json
            end
        end
    end

    after_initialize do
        self.option = {}
        if self.has_attribute?(:options)
            if self.options.present?
                self.option = JSON.parse(self.options)
            else
                self.options = '{}'
            end
        end
    end

    def error_message
        errors = []
        self.errors.each do |key, val|
            errors.push(val)
        end
        return errors.join(', ')
    end

    def force_save
        self.update(updated_at: Time.now)
    end

end
