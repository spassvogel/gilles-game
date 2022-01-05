export type GoldAction = {
  type: 'addGold',
  amount: number
};

export const addGold = (amount: number): GoldAction => ({
  type: 'addGold',
  amount,
});

export const subtractGold = (amount: number): GoldAction => ({
  type: 'addGold',
  amount: -amount,
});
