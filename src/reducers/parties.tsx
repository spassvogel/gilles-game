// tslint:disable:object-literal-sort-keys

import { Reducer } from "redux";
import { PartyStoreState } from "src/stores/party";

const testState = {
    "3tf8h79boh6": {
        adventurers: [
            "c4a5d270",
            "2e655832-65c9-484d-81d7-07938253cf4d",
            "ec6f1050-11e7-11e9-b13b-654a21c6ca63",
            "d299f98a-8f30-4684-b4b5-81baadb388b2",
        ],
        banner: "banner1",
    },
    "rx2nv4rqwn": {
        adventurers: [
            "96c686c3",
            "250d1a9d",
            "169384ef",
            "f22d66cb",
        ],
        banner: "banner2",
    },
};

/**
 * reducer
 * @param state
 * @param action
 */
export const parties: Reducer<Record<string, PartyStoreState>> = 
    (state: Record<string, PartyStoreState> = testState) =>
{
    return state;
};
