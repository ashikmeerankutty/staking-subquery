// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class Nomination implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public nominator?: string;

    public targets?: string[];


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save Nomination entity without an ID");
        await store.set('Nomination', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove Nomination entity without an ID");
        await store.remove('Nomination', id.toString());
    }

    static async get(id:string): Promise<Nomination | undefined>{
        assert((id !== null && id !== undefined), "Cannot get Nomination entity without an ID");
        const record = await store.get('Nomination', id.toString());
        if (record){
            return Nomination.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<Nomination, FunctionPropertyNames<Nomination>>> & Entity): Nomination {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new Nomination(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
