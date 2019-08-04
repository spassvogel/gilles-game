import "components/ui/popup/css/popup.css";
import * as React from "react";

const ARROW_SIZE = 8; // warning: sync to popup.css var
const PADDING = 8;

// Sharing context within the entire App
export interface PopupProps {
    containerRect: ClientRect;
    referenceRect: ClientRect;
    placement?: Placement;
    children: any;
}

export enum Placement {
    bottom,
    top,
    left,
    right,
}

export const withPopup = <TWrappedComponentProps extends PopupProps>(WrappedComponent: React.ComponentType<TWrappedComponentProps>) => {

    const WithPopup = (props: TWrappedComponentProps) => {

        const ref = React.useRef<HTMLDivElement>(null);
        const [ placement, setPlacement ] = React.useState<Placement>(props.placement || Placement.bottom);

        const containerRect = props.containerRect;
        const referenceRect = props.referenceRect;

        React.useEffect(() => {
            // Reposition if needed
            const popupElement = ref.current!;
            const popupRect = popupElement.getBoundingClientRect();

            // Flip vertically
            switch (placement) {
                case Placement.top:
                    if (popupRect.top - popupRect.height - ARROW_SIZE - PADDING < containerRect.top) {
                        // Too high, place underneath
                        setPlacement(Placement.bottom);
                        return;
                    }
                case Placement.bottom:
                    if (popupRect.top + popupRect.height + ARROW_SIZE + PADDING > containerRect.height ) {
                        // Too low, place top
                        setPlacement(Placement.top);
                        return;
                    }
            }
            popupElement.style.opacity = "1"; // animated through css

            // Check left bounding edge
            if (popupRect.left < containerRect.left + PADDING) {
                const offset = containerRect.left - popupRect.left + PADDING;
                const contentElement = popupElement.querySelector(".popup-content") as HTMLElement;
                contentElement.style.transform = `translateX(${offset}px)`;
            }

            // Check right bounding edge
            if (popupRect.right > containerRect.right - PADDING) {
                const offset = popupRect.right - containerRect.right + PADDING;
                const contentElement = popupElement.querySelector(".popup-content") as HTMLElement;
                contentElement.style.transform = `translateX(${-offset}px)`;
            }
        }, [placement]);

        let x: number = 0;
        let y: number = 0;
        let className: string = "";

        switch (placement) {
            case Placement.bottom:
                x = referenceRect.left - containerRect.left + referenceRect.width / 2;
                y = referenceRect.top - containerRect.top + referenceRect.height;
                className = "popup-bottom";
                break;
            case Placement.top:
                x = referenceRect.left - containerRect.left + referenceRect.width / 2;
                y = referenceRect.top - containerRect.top;
                className = "popup-top";
                break;
        }

        return (
            <div className = { `popup ${className}` }
                style = {{
                    left: x,
                    opacity: 0,
                    top: y,
                }}
                ref = { ref }
            >
                <div className = "popup-arrow"></div>
                <div className = "popup-content">
                    <WrappedComponent {...props } />
                </div>
            </div>
        );
    }
    return WithPopup;
};
// export const withPopup = <P extends object>(Component: React.ComponentType<P>): React.FC<P & PopupProps> => ({...props}: PopupProps) => {
//     return     <div className = "popup" style = {{ background: "pink" }} >
//          <Component {...props as P} />
//     </div>
// };
