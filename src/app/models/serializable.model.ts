export abstract class Serializable {

    static createArray(jsonArray: any[], instance: Serializable): Array<any> {
        const result: any[] = [];
        for (const data of jsonArray) {
            if (typeof instance['newModel'] === 'function') {
                result.push(instance.newModel(data));
            } else {
                result.push(data);
            }
        }
        return result;
    }

    static createOne(data: any, instance: Serializable): any {
        return instance.newModel(data);
    }

    constructor(json?: any) {
        if (json) {
            Object.assign(this, json);
        }
    }

    abstract newModel(data: any): Serializable;



}
