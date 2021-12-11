// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class EraSlashes implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public validators?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save EraSlashes entity without an ID");
        await store.set('EraSlashes', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove EraSlashes entity without an ID");
        await store.remove('EraSlashes', id.toString());
    }

    static async get(id:string): Promise<EraSlashes | undefined>{
        assert((id !== null && id !== undefined), "Cannot get EraSlashes entity without an ID");
        const record = await store.get('EraSlashes', id.toString());
        if (record){
            return EraSlashes.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<EraSlashes, FunctionPropertyNames<EraSlashes>>> & Entity): EraSlashes {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new EraSlashes(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
