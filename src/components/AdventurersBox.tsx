// TODO: Better name than this

import * as React from "react";
import { AdventurerStoreState } from "src/stores/adventurer";
import { PartyStoreState } from "src/stores/party";
//import "./css/adventurersbox.css";

export interface DispatchProps {
    //onChange?: (amount: number) => void;
}

export interface StateProps {
    parties: PartyStoreState[];
    adventurers: AdventurerStoreState[];
}

export interface Props {
    name: string;
    amount?: number;
}

type AllProps = Props & StateProps;

const AdventurersBox = (props: Props) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    };

    const generateRow = (adventurers: Array<AdventurerStoreState>): JSX.Element => {
        return <li></li>;
    }


    return (
        <ul className="adventurers-box">
        </ul>
    );
}
export default AdventurersBox;