// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';

import {
    Vote,
} from '../interfaces'




export class Referendum implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public votes?: Vote[];


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Referendum entity without an ID");
        await store.set('Referendum', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Referendum entity without an ID");
        await store.remove('Referendum', id.toString());
    }

    static async get(id:string): Promise<Referendum | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Referendum entity without an ID");
        const record = await store.get('Referendum', id.toString());
        if (record){
            return Referendum.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<Referendum, FunctionPropertyNames<Referendum>>> & Entity): Referendum {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Referendum(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
