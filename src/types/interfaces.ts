// SPDX-License-Identifier: Apache-2.0

// Auto-generated , DO NOT EDIT

export interface Others {

    who?: string;

    value?: string;

}


export interface ValidatorPrefs {

    commission?: string;

    blocked?: boolean;

}


export interface IdentityField {

    display?: string;

    judgements?: string[];

    legal?: string;

}


export interface Identity {

    identity?: IdentityField;

}


export interface Exposure {

    total?: string;

    own?: number;

    others?: Others[];

}


export interface StrakingLedger {

    total?: string;

    claimedRewards?: number[];

}


