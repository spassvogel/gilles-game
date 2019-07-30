export enum IconSize {
    smallest,
    small,
    medium,
    big,
    biggest,
}

export const getClassName = (size?: IconSize): string => {
    switch (size) {
        case IconSize.smallest:
            return "common-icon-smallest";
        case IconSize.small:
            return "common-icon-small";
        case IconSize.medium:
            return "common-icon-medium";
        case IconSize.big:
            return "common-icon-big";
        case IconSize.biggest:
            return "common-icon-biggest";
    }
    return getClassName(IconSize.medium);
};
