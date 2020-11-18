class AddUserMigration < ActiveRecord::Migration[5.2]

    def change;
        create_table 'users', force: :cascade, options: 'ENGINE=InnoDB DEFAULT CHARSET=utf8', id: :integer do |t|
            t.string    'cognito_id'
            t.string    'name'
            t.string    'email'
            t.boolean   'enabled',              default: false,         null: false
            t.boolean   'archived',             default: false,         null: false
            t.string    'options',                                                          limit: 4096
            t.datetime  'created_at',                                   null: false
            t.datetime  'updated_at',                                   null: false
        end
    end

end
