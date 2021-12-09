// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class ValidatorRanking implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId?: string;

    public index?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save ValidatorRanking entity without an ID");
        await store.set('ValidatorRanking', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove ValidatorRanking entity without an ID");
        await store.remove('ValidatorRanking', id.toString());
    }

    static async get(id:string): Promise<ValidatorRanking | undefined>{
        assert((id !== null && id !== undefined), "Cannot get ValidatorRanking entity without an ID");
        const record = await store.get('ValidatorRanking', id.toString());
        if (record){
            return ValidatorRanking.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<ValidatorRanking, FunctionPropertyNames<ValidatorRanking>>> & Entity): ValidatorRanking {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new ValidatorRanking(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
