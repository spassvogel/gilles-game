import { useEffect, useRef } from "react";

const usePrevious = <T extends {}>(value: T) => {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
};
export default usePrevious;
