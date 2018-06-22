import { IArgsType } from "../enums/eargs-type.enum";

export class Utils {
    /**
     * Argumentos para validar.
     * @param args Arguments for validate
     */
    public static validateArgs(args): IArgsType {
        if(!Array.isArray(args) && !(args instanceof Object))
            throw new Error('This arguments not is Array.');

        if(!Array.isArray(args))
            return IArgsType.named;
        else
            return IArgsType.replaced;
    }
}