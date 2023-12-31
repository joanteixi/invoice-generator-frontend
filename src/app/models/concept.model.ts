import { Serializable } from "app/models/serializable.model";


export class ConceptModel extends Serializable {

    public id: string;
    public name: string;
    public base_price: number
    public created_at: Date

    
    newModel(data: any): ConceptModel {
        const dataParsed = new ConceptModel(data);       
        return dataParsed;
    }

    public static getFieldNames(): string[] {
        return Object.keys(ConceptModel.prototype)
            .filter(key => typeof ConceptModel.prototype[key] !== 'function');
    }

}
