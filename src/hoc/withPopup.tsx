import "components/ui/popup/css/popup.css";
import * as React from "react";

// Sharing context within the entire App
export interface PopupProps {
    containerRect: ClientRect;
    referenceRect: ClientRect;
    placement?: Placement;
}

export enum Placement {
    bottom,
    top,
    left,
    right,
}

export const withPopup = <TWrappedComponentProps extends PopupProps>(WrappedComponent: React.ComponentType<TWrappedComponentProps>) => {
    return class WithPopup extends React.Component<TWrappedComponentProps> {
        private popupRef: React.RefObject<HTMLDivElement>;

        constructor(props: TWrappedComponentProps) {
            super(props);
            this.popupRef = React.createRef();
        }

        public render() {

            const containerRect = this.props.containerRect;
            const referenceRect = this.props.referenceRect;
            const placement = this.props.placement || Placement.bottom;

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
                        top: y,
                    }}
                    ref = { this.popupRef }
                >
                    <div className = "popup-arrow"></div>
                    <WrappedComponent {...this.props } />
                </div>
            );
        }


        public componentDidUpdate() {
           // console.log(this.props.originRef)
            // if(this.popupRef && this.props.originRef.current) {
            //     const container = this.props.containerRef.current as HTMLElement;
            //     const containerRect = container.getBoundingClientRect();
            //     // console.log(rect);

            //     const referenceRect = this.props.referenceRect;

            //     const popup = this.popupRef.current as HTMLElement;
            //     const popupRect = (popup).getBoundingClientRect();

            //     // placement: bottom
            //     const x = referenceRect.left - containerRect.left + referenceRect.width / 2;
            //     const y = referenceRect.top - containerRect.top + referenceRect.height;
            //     popup.style.left = `${x}px`;
            //     popup.style.top = `${y}px`;

//                console.log(this.props.originRef.current.getBoundingClientRect())

/*                var popper = new Popper(origin2, origin, {
                    placement: 'right'
                });
             
            }*/  
        }
    };
};
// export const withPopup = <P extends object>(Component: React.ComponentType<P>): React.FC<P & PopupProps> => ({...props}: PopupProps) => {
//     return     <div className = "popup" style = {{ background: "pink" }} >
//          <Component {...props as P} />
//     </div>
// };
