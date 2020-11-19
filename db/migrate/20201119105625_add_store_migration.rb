class AddStoreMigration < ActiveRecord::Migration[5.2]
    def change
        create_table 'stores', force: :cascade, options: 'ENGINE=InnoDB DEFAULT CHARSET=utf8', id: :integer do |t|
            t.string    'name',                 limit: 20
            t.string    'owner',                limit: 16
            t.datetime  'created_at',                                   null: false
            t.datetime  'updated_at',                                   null: false
        end
    end
end
