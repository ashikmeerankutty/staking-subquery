// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT

export interface Exposure {

    total?: string;

    own?: string;

    others?: Others[];

}


export interface Others {

    who?: string;

    value?: string;

}


export interface StakingLedger {

    stash?: string;

    total?: number;

    active?: number;

    claimedRewards?: number[];

}


export interface ValidatorPrefs {

    commission?: string;

    blocked?: boolean;

}


export interface Vote {

    accountId?: string;

}


