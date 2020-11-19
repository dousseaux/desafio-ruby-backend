class AddTrantypeMigration < ActiveRecord::Migration[5.2]
    def change
        create_table 'trantypes', force: :cascade, options: 'ENGINE=InnoDB DEFAULT CHARSET=utf8', id: :integer do |t|
            t.string    'description',          limit: 30
            t.string    'deb_or_decred',        limit: 12
            t.string    'signal',               limit: 1
            t.datetime  'created_at',                                   null: false
            t.datetime  'updated_at',                                   null: false
        end
    end
end
