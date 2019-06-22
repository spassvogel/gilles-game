// tslint:disable:object-literal-sort-keys

import { Reducer } from "redux";
import { PartyStoreState } from "src/stores/party";

const testState: Record<string, PartyStoreState> = {
    "3tf8h79boh6": {
        adventurers: [
            "c4a5d270",
            "2e655832",
            "ec6f1050",
            "d299f98a",
        ],
        sigil: "sigil1.png",
    },
    "rx2nv4rqwn": {
        adventurers: [
            "96c686c3",
            "250d1a9d",
            "169384ef",
            "f22d66cb",
        ],
        sigil: "sigil2.png",
    },
};

/**
 * reducer
 * @param state
 * @param action
 */
export const parties: Reducer<Record<string, PartyStoreState>> =
    (state: Record<string, PartyStoreState> = testState) => {
    return state;
};
