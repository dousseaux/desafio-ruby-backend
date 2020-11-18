# encoding: UTF-8

class User < ApplicationRecord

    attr_accessor :nickname
    attr_accessor :subs

    validates :cognito_id, presence: true, uniqueness: { message: 'cognito user already registered' }
    validates :email, presence: true, uniqueness: { case_sensitive: false, message: 'e-mail already used by another user' }

    has_many  :speciality

    after_initialize do
        self.nickname = self.name.split(' ').first.truncate(24)
    end

    before_save do
        if self.has_attribute?(:subscription)
            self.subscription = self.subs.to_json
        end
    end

    after_initialize do
        self.subs = {}
        if self.has_attribute?(:subscription)
            if self.subscription.present?
                self.subs = JSON.parse(self.subscription)
            end
        end
    end

    def validate_registration
        validation = !(self.cognito_id.blank? || self.email.blank? || self.name.blank?)
        unless self.usertype == 'admin'
            validation = validation && !(self.phone.blank? || self.cpfcnpj.blank? || self.rg.blank? || self.birthdate.blank?)
            validation = validation && !(
                self.address_postal.blank? || self.address_city.blank? || self.address_state.blank? || self.address_country.blank?
            )
            if self.usertype == 'lawyer'
                validation = validation && !(self.oab.blank?)
            end
        end
        return self.update(enabled: validation)
    end

    def self.usertypes
        {
            'Administrador' => 'admin',
            'Cliente' => 'customer',
            'Advogado' => 'lawyer'
        }
    end

    def usertype_str
        self.class.usertypes.key(self.usertype)
    end

    def admin
        self.usertype == 'admin'
    end

    def customer
        self.usertype == 'customer'
    end

    def lawyer
        self.usertype == 'lawyer' || self.usertype == 'admin'
    end

    def subscription_status
        s = 'ATIVO'
        unless self.active
            s = 'NÃO ATIVO'
            unless self.subs.blank?
                s = "#{s} - #{self.subs['juno']['status']}"
            end
        end
        return s
    end

    def self.subscription_sync
        users = User.where(usertype: 'lawyer', archived: false, enabled: true).where("subscription IS NOT NULL AND subscription != '{}'")
        users.each do |u|
            unless u.subs.blank?
                juno = Duxutils::Juno2::subscription(u.subs['id'])
                if juno['status']
                    u.subs['juno'] = juno['subscription']
                    u.active = u.subs['juno']['status'] == 'ACTIVE'
                    u.force_save
                end
            end
        end
    end

end
