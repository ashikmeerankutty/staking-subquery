// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';

import {
    Exposure,

    Identity,

    ValidatorPrefs,

    StrakingLedger,
} from '../interfaces'




export class ValidatorsInfo implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public accountId?: string;

    public controllerId?: string;

    public exposure?: Exposure;

    public identity?: Identity[];

    public stashId?: string;

    public validatorPrefs?: ValidatorPrefs;

    public stakingLedger?: StrakingLedger;

    public active?: boolean;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save ValidatorsInfo entity without an ID");
        await store.set('ValidatorsInfo', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove ValidatorsInfo entity without an ID");
        await store.remove('ValidatorsInfo', id.toString());
    }

    static async get(id:string): Promise<ValidatorsInfo | undefined>{
        assert((id !== null && id !== undefined), "Cannot get ValidatorsInfo entity without an ID");
        const record = await store.get('ValidatorsInfo', id.toString());
        if (record){
            return ValidatorsInfo.create(record);
        }else{
            return;
        }
    }



    static create(record: Partial<Omit<ValidatorsInfo, FunctionPropertyNames<ValidatorsInfo>>> & Entity): ValidatorsInfo {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new ValidatorsInfo(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
