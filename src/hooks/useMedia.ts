import { AppContext } from "components/App";
import { useContext } from "react";

export const useMedia = () => {
    const context = useContext(AppContext)!;

    const all = context.media!;
    const find = (url: string) => {
        const found = all.find((m) => m.url === url);
        return found?.content;
    };

    return find;
};
