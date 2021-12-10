// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class EraPreferences implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public validators?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save EraPreferences entity without an ID");
        await store.set('EraPreferences', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove EraPreferences entity without an ID");
        await store.remove('EraPreferences', id.toString());
    }

    static async get(id:string): Promise<EraPreferences | undefined>{
        assert((id !== null && id !== undefined), "Cannot get EraPreferences entity without an ID");
        const record = await store.get('EraPreferences', id.toString());
        if (record){
            return EraPreferences.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<EraPreferences, FunctionPropertyNames<EraPreferences>>> & Entity): EraPreferences {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new EraPreferences(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
