import { SMQ } from './src/sqm';

let manglo = new SMQ();
let queryTest = manglo.prepare("SELECT * FROM docType.FinancialDoc WHERE docData.isValid=':isValid'")
        .getQuery({isValid: '" asdfasdf'});

// QUERY OK AGORA É SO CONVERTER PARA MANGO

console.log(queryTest);