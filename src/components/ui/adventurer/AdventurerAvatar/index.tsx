import * as React from "react";
import { AdventurerStoreState } from "stores/adventurer";
import { getClassName, IconSize } from 'constants/icons';
import "./styles/adventureravatar.scss";

export interface Props {
    adventurer: AdventurerStoreState;
    className?: string;
    displayName?: boolean;
    onClick?: (adventurerId: string) => void;
    size?: IconSize;
}

/**
 * The AdventurerAvatar displays the avatar of an adventurer
 */
const AdventurerAvatar = (props: Props) => {
    const {
        adventurer,
        size
    } = props;

    const className = (props.className || "") +
        (size !== undefined ? getClassName(size) : "") +
        " avatar";

    const handleClick = () => {
        if (props.onClick) {
            props.onClick(props.adventurer.id);
        }
    };
    return (
        <div className = { className }
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${adventurer.avatarImg})` }}
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
