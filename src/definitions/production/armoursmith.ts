import { Apparel } from 'definitions/items/apparel';
import * as time from 'utils/format/time';
import {  ProductionDefinition } from './types';

// todo: real values for costs
const armoursmithProduction: { [key in Apparel]?: ProductionDefinition } = {
  'apparel/boots1': {
    item: { type: 'apparel/boots1' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/boots2': {
    item: { type: 'apparel/boots2' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
    levelRequired: 2,
  },
  'apparel/boots3': {
    item: { type: 'apparel/boots3' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
    levelRequired: 3,
  },
  'apparel/chainmailHood': {
    item: { type: 'apparel/chainmailHood' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/chest': {
    item: { type: 'apparel/chest' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/clothGloves': {
    item: { type: 'apparel/clothGloves' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/cowl': {
    item: { type: 'apparel/cowl' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/druidChest': {
    item: { type: 'apparel/druidHands' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
    levelRequired: 2,
  },
  'apparel/druidFeet': {
    item: { type: 'apparel/druidFeet' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
    levelRequired: 2,
  },
  'apparel/druidHands': {
    item: { type: 'apparel/druidHands' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
    levelRequired: 2,
  },
  'apparel/druidHead': {
    item: { type: 'apparel/druidHead' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
    levelRequired: 2,
  },
  'apparel/druidLegs': {
    item: { type: 'apparel/druidLegs' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
    levelRequired: 2,
  },
  'apparel/fedora': {
    item: { type: 'apparel/fedora' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/greaves1': {
    item: { type: 'apparel/greaves1' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/greaves2': {
    item: { type: 'apparel/greaves2' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/hornedHelmet': {
    item: { type: 'apparel/hornedHelmet' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/leatherGloves': {
    item: { type: 'apparel/leatherGloves' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/nomadHelmet': {
    item: { type: 'apparel/nomadHelmet' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/pants1': {
    item: { type: 'apparel/pants1' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/pants2': {
    item: { type: 'apparel/pants2' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/plateChest1': {
    item: { type: 'apparel/plateChest1' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/plateChest2': {
    item: { type: 'apparel/plateChest2' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/plateChest3': {
    item: { type: 'apparel/plateChest3' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/plateChest4': {
    item: { type: 'apparel/plateChest4' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/plateGloves1': {
    item: { type: 'apparel/plateGloves1' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/plateGloves2': {
    item: { type: 'apparel/plateGloves2' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/plateHelmet': {
    item: { type: 'apparel/plateHelmet' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/platePants': {
    item: { type: 'apparel/platePants' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/plateShoulders1': {
    item: { type: 'apparel/plateShoulders1' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/plateShoulders2': {
    item: { type: 'apparel/plateShoulders2' },
    cost: {
      resources: {
        wood: 10,
        iron: 45,
      },
      time: time.ONE_HOUR,
    },
  },
  'apparel/robe': {
    item: { type: 'apparel/robe' },
    cost: {
      resources: { wood: 10, iron: 45 },
      time: time.ONE_HOUR,
    },
  },
  'apparel/shoulders1': {
    item: { type: 'apparel/shoulders1' },
    cost: {
      resources: { wood: 10, iron: 45 },
      time: time.ONE_HOUR,
    },

  },
  'apparel/shoulders2': {
    item: { type: 'apparel/shoulders2' },
    cost: {
      resources: { wood: 10, iron: 45 },
      time: time.ONE_HOUR,
    },

  },
  'apparel/shoulders3': {
    item: { type: 'apparel/shoulders3' },
    cost: {
      resources: { wood: 10, iron: 45 },
      time: time.ONE_HOUR,
    },

  },
  'apparel/vest': {
    item: { type: 'apparel/vest' },
    cost: {
      resources: { wood: 10, iron: 45 },
      time: time.ONE_HOUR,
    },
  },
};
export default armoursmithProduction;
