// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class CouncilVotes implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public stake?: string;

    public votes?: string[];


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save CouncilVotes entity without an ID");
        await store.set('CouncilVotes', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove CouncilVotes entity without an ID");
        await store.remove('CouncilVotes', id.toString());
    }

    static async get(id:string): Promise<CouncilVotes | undefined>{
        assert((id !== null && id !== undefined), "Cannot get CouncilVotes entity without an ID");
        const record = await store.get('CouncilVotes', id.toString());
        if (record){
            return CouncilVotes.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<CouncilVotes, FunctionPropertyNames<CouncilVotes>>> & Entity): CouncilVotes {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new CouncilVotes(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
