import * as React from "react";
import { AdventurerStoreState } from "src/stores/adventurer";
import "./css/adventureravatar.css";

export interface Props {
    adventurer: AdventurerStoreState;
    className?: string;
    displayName?: boolean;
    onClick?: (adventurerId: string) => void;
}

/**
 * The AdventurerAvatar displays the avatar of an adventurer in the party screen
 */
const AdventurerAvatar = (props: Props) => {
    const {
        adventurer,
    } = props;

    const className = (props.className || "") + " avatar";

    const handleClick = () => {
        if (props.onClick) {
            props.onClick(props.adventurer.id);
        }
    };
    return (
        <div className = { className }
            style={{ backgroundImage: `url(${adventurer.avatarImg})` }}
            onClick={ () => handleClick() }>
            <div className="sizer"/>
            {
                props.displayName && <div className="name">
                    { adventurer.name }
                </div>
            }
        </div>
    );
};

export default AdventurerAvatar;
