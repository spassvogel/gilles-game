import { AppContext } from "components/App";
import { useContext } from "react";

export const useMedia = () => {
    const context = useContext(AppContext)!;

    const all = context.media!;
    const find = (url: string) => {
        const found = all.find((m) => m.url === url);
        // todo: option chaining (null coalescing operator)
        return found ? found.content : null;
    };

    return find;
};
