import { IArgsType } from "./enums/eargs-type.enum";
import { Utils } from "./libs/utils";
import { IPreparedQuery } from "./interfaces/iprepared-query";

export class SMQ {

    sql: string;

    /**
     * Prepara a Query para gerar a Mango Query
     * @param sql SQL para transformar em Mango Query
     */
    public prepare(sql: string): IPreparedQuery {
        this.sql = sql;
        return this;
    }

    /**
     * Recupera o objeto da manglo query para fazer a consulta.
     * @param args Argumentos para fazer o bind
     */
    public getQuery (args?: any) {

        if(!this.sql)
            throw new Error('The prepare method is not called.');

        let argType: IArgsType = null;
        if(args) {
            argType = Utils.validateArgs(args);
        }

        let localSql = this.sql;

        // preparando slashes para não conflitar
        localSql = localSql.replace(/'/g, "\"");
        
        // control variables to check match parameters
        let paramsMatch: number = 0;
        let paramsInQuery: number = 0;
        if(argType) {
            switch(argType) {
                case IArgsType.replaced:
                    paramsInQuery = (localSql.match(/\?/g) || []).length;
                    for(let arg of args) {
                        if(localSql.indexOf("?") === -1)
                            throw new Error('the parameters do not match');
                        paramsMatch++;
                        localSql = localSql.replace('?', this.prepareValue(arg));
                    }
                    break;
                case IArgsType.named:
                    const argsKeys = Object.keys(args);
                    paramsInQuery = (localSql.match(/\:/g) || []).length;
                    for(let arg of argsKeys) {
                        if(localSql.indexOf(`:${arg}`) === -1)
                            throw new Error(`The parameter :${arg} do not match`);

                        paramsMatch += (localSql.match(new RegExp(':'+arg, 'g')) || []).length;
                        localSql = localSql.replace(new RegExp(':' + arg, 'g'), this.prepareValue(args[arg]));
                    }
                    break;
                default:
                    if(localSql.indexOf('?') || localSql.indexOf(':'))
                        throw new Error('This query require arguments');
            }
        }

        // check if all parameters is setted.
        if(paramsInQuery != paramsMatch)
            throw new Error('missing parameters to execute your query')

        return localSql;
    }

    /**
     * Converte valores para evitar quebra da Síntaxe SQL
     * @param value Valor para tratar
     */
    private prepareValue(value: any) {
        if(typeof value === 'string') {
            return value.replace(new RegExp("\"", "g"), "\\\"");
        } else {
            return value;
        }
    }
}