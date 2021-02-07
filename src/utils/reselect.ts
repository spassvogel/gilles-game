import { createSelectorCreator, defaultMemoize } from 'reselect';
import stringArrayEqual from 'string-arrays-equal';

export const createStringArraySelector = createSelectorCreator<string>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: https://github.com/reduxjs/reselect/issues/384
  defaultMemoize,
  stringArrayEqual
);