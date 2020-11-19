# encoding: UTF-8

class Transaction < ApplicationRecord

    belongs_to :store
    has_one :trantype

end
