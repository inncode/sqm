import { expect } from 'chai';
import 'mocha';
import { SMQ } from './sqm';

describe('SQM Prepare Bindings With "getQuery" method.', () => {

    it('should select with 1 named param', () => {
        let manglo = new SMQ();
        let queryTest = manglo.prepare("SELECT * FROM docType.FinancialDoc WHERE docData.isValid=:isValid")
            .getQuery({ isValid: true });
        expect(queryTest).to.equal('SELECT * FROM docType.FinancialDoc WHERE docData.isValid=true');
    });

    it('should select with 2 named params', () => {
        let manglo = new SMQ();
        let queryTest = manglo.prepare("SELECT * FROM docType.FinancialDoc WHERE docData.isValid=:isValid and docData.name=':testString'")
            .getQuery({
                isValid: true,
                testString: "hello-doc"
            });
        expect(queryTest).to.equal('SELECT * FROM docType.FinancialDoc WHERE docData.isValid=true and docData.name="hello-doc"');
    });

    it('should select with 1 replaced param', () => {
        let manglo = new SMQ();
        let queryTest = manglo.prepare("SELECT * FROM docType.FinancialDoc WHERE docData.isValid=?")
            .getQuery([true]);
        expect(queryTest).to.equal('SELECT * FROM docType.FinancialDoc WHERE docData.isValid=true');
    });

    it('should select with 2 replaced params', () => {
        let manglo = new SMQ();
        let queryTest = manglo.prepare("SELECT * FROM docType.FinancialDoc WHERE docData.isValid=? and docData.name='?'")
            .getQuery([true, "hello-doc"]);
        expect(queryTest).to.equal('SELECT * FROM docType.FinancialDoc WHERE docData.isValid=true and docData.name="hello-doc"');
    });

    it('should select sintax correction in slashes', () => {
        let manglo = new SMQ();
        let queryTest = manglo.prepare("SELECT * FROM docType.FinancialDoc WHERE docData.isValid=? and docData.name='?'")
            .getQuery([true, 'hello-doc "the test"']);
        expect(queryTest).to.equal('SELECT * FROM docType.FinancialDoc WHERE docData.isValid=true and docData.name="hello-doc \\"the test\\""');
    });

});