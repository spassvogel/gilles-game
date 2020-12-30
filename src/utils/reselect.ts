import { createSelectorCreator, defaultMemoize } from 'reselect';
import stringArrayEqual from 'string-arrays-equal';

export const createStringArraySelector = createSelectorCreator<string>(
  // @ts-ignore: https://github.com/reduxjs/reselect/issues/384
  defaultMemoize,
  stringArrayEqual
);