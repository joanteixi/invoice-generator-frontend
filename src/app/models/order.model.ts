import { Serializable } from "app/models/serializable.model";
import { OrderItemModel } from "./orderItem.model";


export class OrderModel extends Serializable {

    public id: string;
    public customer_name: string;
    public created_at: Date
    public order_items: Array<OrderItemModel>;

    
    newModel(data: any): OrderModel {
        const dataParsed = new OrderModel(data);       
        return dataParsed;
    }

    public static getFieldNames(): string[] {
        return Object.keys(OrderModel.prototype)
            .filter(key => typeof OrderModel.prototype[key] !== 'function');
    }

}
