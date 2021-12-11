// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




export class MaxNominatorRewardedPerValidator implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public maxNominatorRewardedPerValidator?: number;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save MaxNominatorRewardedPerValidator entity without an ID");
        await store.set('MaxNominatorRewardedPerValidator', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove MaxNominatorRewardedPerValidator entity without an ID");
        await store.remove('MaxNominatorRewardedPerValidator', id.toString());
    }

    static async get(id:string): Promise<MaxNominatorRewardedPerValidator | undefined>{
        assert((id !== null && id !== undefined), "Cannot get MaxNominatorRewardedPerValidator entity without an ID");
        const record = await store.get('MaxNominatorRewardedPerValidator', id.toString());
        if (record){
            return MaxNominatorRewardedPerValidator.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<MaxNominatorRewardedPerValidator, FunctionPropertyNames<MaxNominatorRewardedPerValidator>>> & Entity): MaxNominatorRewardedPerValidator {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new MaxNominatorRewardedPerValidator(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
