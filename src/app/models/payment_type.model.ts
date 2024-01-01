import { Serializable } from "app/models/serializable.model";


export class PaymentTypeModel extends Serializable {

    public id: string;
    public payment_type: string;
    public created_at: Date

    
    newModel(data: any): PaymentTypeModel {
        const dataParsed = new PaymentTypeModel(data);       
        return dataParsed;
    }

    public static getFieldNames(): string[] {
        return Object.keys(PaymentTypeModel.prototype)
            .filter(key => typeof PaymentTypeModel.prototype[key] !== 'function');
    }

}
