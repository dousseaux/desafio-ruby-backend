File.readlines('CNAB.txt').each do |row|

    store_params = {
        name: row[62..79].strip(),
        owner: row[48..61].strip()
    }

    store = Store.where(name: store_params[:name], owner: store_params[:owner]).first
    if store.blank?
        store = Store.create(store_params)
    end

    if store.blank?
    else
        transaction_params = {
            store_id: store.id,
            trantype_id: row[0..0].strip().to_i,
            amount: row[9..18].strip().to_f / 100,
            cpf: row[19..29].strip(),
            card: row[30..41].strip(),
            transaction_dt: Time.strptime(row[1..8].strip() + row[42..47].strip(), '%Y%m%d%H%M%S')
        }
        transaction = Transaction.create(transaction_params)
        unless transaction.errors.blank?
        end
    end

    puts store_params
    puts transaction_params

end
