//Safely intersect prop types
export type OverrideProps<TBaseProps, TNewProps> = Omit<TBaseProps, keyof TNewProps> & TNewProps;

// Infer possible prop types of `typeof MyComponent`.
export type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never