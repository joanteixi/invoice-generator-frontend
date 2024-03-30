import { Serializable } from "app/models/serializable.model";


export class OrderItemModel extends Serializable {

    public order_item_id: string;
    public concept_id: number;
    public quantity: number;
    public price: number;
    public month: number;
    public year: number;
   
    
    newModel(data: any): OrderItemModel {
        const dataParsed = new OrderItemModel(data);       
        return dataParsed;
    }

    public static getFieldNames(): string[] {
        return Object.keys(OrderItemModel.prototype)
            .filter(key => typeof OrderItemModel.prototype[key] !== 'function');
    }

}
