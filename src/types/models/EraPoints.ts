// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class EraPoints implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public eraPoints?: string;

    public validators?: string;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save EraPoints entity without an ID");
        await store.set('EraPoints', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove EraPoints entity without an ID");
        await store.remove('EraPoints', id.toString());
    }

    static async get(id:string): Promise<EraPoints | undefined>{
        assert((id !== null && id !== undefined), "Cannot get EraPoints entity without an ID");
        const record = await store.get('EraPoints', id.toString());
        if (record){
            return EraPoints.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<EraPoints, FunctionPropertyNames<EraPoints>>> & Entity): EraPoints {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new EraPoints(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
