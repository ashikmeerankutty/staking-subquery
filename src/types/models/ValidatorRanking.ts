// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';

import {
    StakeHistory,

    PayoutHistory,

    PerformanceHistory,

    EraPointsHistory,

    CommissionHistory,

    IdentityField,
} from '../interfaces'


export class ValidatorRanking implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public active?: boolean;

    public activeRating?: number;

    public name?: string;

    public hasSubIdentity?: boolean;

    public subAccountsRating?: number;

    public verifiedIdentity?: boolean;

    public identityRating?: number;

    public stashAddress?: string;

    public controllerAddress?: string;

    public partOfCluster?: boolean;

    public clusterName?: string;

    public clusterMembers?: number;

    public showClusterMember?: boolean;

    public nominators?: number;

    public nominatorsRating?: number;

    public commission?: number;

    public commissionRating?: number;

    public activeEras?: number;

    public eraPointsPercent?: string;

    public eraPointsRating?: number;

    public performance?: number;

    public slashed?: boolean;

    public slashRating?: number;

    public councilBacking?: boolean;

    public activeInGovernance?: boolean;

    public governanceRating?: number;

    public payoutRating?: number;

    public selfStake?: string;

    public otherStake?: string;

    public totalStake?: string;

    public totalRating?: number;

    public stakeHistory?: StakeHistory[];

    public payoutHistory?: PayoutHistory[];

    public slashes?: string[];

    public performanceHistory?: PerformanceHistory[];

    public eraPointsHistory?: EraPointsHistory[];

    public commissionHistory?: CommissionHistory[];

    public identity?: IdentityField[];


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
