# encoding: UTF-8

class TransactionsController < ApplicationController

    def create
        file_params = params.require(:data_upload).permit(:file)
        if defined? file_params[:file].tempfile
            success = true
            File.readlines(file_params[:file].tempfile.path).each do |row|
                store_params = {
                    name: row[62..79].strip(),
                    owner: row[48..61].strip()
                }
                store = Store.where(name: store_params[:name], owner: store_params[:owner]).first
                if store.blank?
                    store = Store.create(store_params)
                end
                if store.blank?
                    success = success && false
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
                        success = success && false
                    end
                end
            end
            if success
                flash[:notice] = 'Dados importados com sucesso.'
            else
                flash[:notice] = 'Falha ao importar dados.'
            end
        else
            flash[:notice] = 'Não foi possível ler o arquivo.'
        end

        redirect_to user_dashboard_path
    end

end
