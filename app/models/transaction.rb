# encoding: UTF-8

class Transaction < ApplicationRecord

    belongs_to :store
    belongs_to :trantype

end
