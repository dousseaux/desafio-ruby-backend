class AddTransactionMigration < ActiveRecord::Migration[5.2]
    def change
        create_table 'transactions', force: :cascade, options: 'ENGINE=InnoDB DEFAULT CHARSET=utf8', id: :integer do |t|
            t.integer   'store_id'
            t.integer   'trantype_id'
            t.decimal   'amount',                                                     precision: 14, scale: 2
            t.string    'cpf',                  limit: 12
            t.string    'card',                 limit: 14
            t.datetime  'transaction_dt'
            t.datetime  'created_at',                                   null: false
            t.datetime  'updated_at',                                   null: false
            t.index     ['store_id'], name: 'index_transactions_on_store_id', using: :btree
            t.index     ['trantype_id'],  name: 'index_transactions_on_trantype_id', using: :btree
        end
    end
end
