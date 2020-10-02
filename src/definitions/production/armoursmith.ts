// tslint:disable:object-literal-sort-keys

import * as time from "utils/format/time";
import {    Item} from "../items/types";
import {  ProductionDefinition } from "./types";

// todo: real values for costs
const armoursmithProduction: { [key: string]: ProductionDefinition } = {
    [Item.boots1]: {
        item: Item.boots1,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
    },
    [Item.boots2]: {
        item: Item.boots2,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 2
    },
    [Item.boots3]: {
        item: Item.boots3,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 3
    },
    [Item.chainmailHood]: {
        item: Item.chainmailHood,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.chest]: {
        item: Item.chest,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.clothGloves]: {
        item: Item.clothGloves,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
    },
    [Item.cowl]: {
        item: Item.cowl,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.druidChest]: {
        item: Item.druidHands,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 2
    },
    [Item.druidFeet]: {
        item: Item.druidFeet,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 2
    },
    [Item.druidHands]: {
        item: Item.druidHands,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 2
    },
    [Item.druidHead]: {
        item: Item.druidHead,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 2
    },
    [Item.druidLegs]: {
        item: Item.druidLegs,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 2
    },
    [Item.fedora]: {
        item: Item.fedora,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.greaves1]: {
        item: Item.greaves1,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.greaves2]: {
        item: Item.greaves2,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.hornedHelmet]: {
        item: Item.hornedHelmet,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.leatherGloves]: {
        item: Item.leatherGloves,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.nomadHelmet]: {
        item: Item.nomadHelmet,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.pants1]: {
        item: Item.pants1,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.pants2]: {
        item: Item.pants2,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.plateChest1]: {
        item: Item.plateChest1,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.plateChest2]: {
        item: Item.plateChest2,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.plateChest3]: {
        item: Item.plateChest3,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.plateChest4]: {
        item: Item.plateChest4,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.plateGloves1]: {
        item: Item.plateGloves1,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.plateGloves2]: {
        item: Item.plateGloves2,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.plateHelmet]: {
        item: Item.plateHelmet,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.platePants]: {
        item: Item.platePants,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.plateShoulders1]: {
        item: Item.plateShoulders1,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.plateShoulders2]: {
        item: Item.plateShoulders2,
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    [Item.robe]: {
        item: Item.robe,
        cost: {
            resources: { wood: 10, iron: 45},
            time: time.ONE_HOUR,
        }
    },
    [Item.shoulders1]: {
        item: Item.shoulders1,
        cost: {
            resources: { wood: 10, iron: 45},
            time: time.ONE_HOUR,
        }

    },
    [Item.shoulders2]: {
        item: Item.shoulders2,
        cost: {
            resources: { wood: 10, iron: 45},
            time: time.ONE_HOUR,
        }

    },
    [Item.shoulders3]: {
        item: Item.shoulders3,
        cost: {
            resources: { wood: 10, iron: 45},
            time: time.ONE_HOUR,
        }

    },
    [Item.vest]: {
        item: Item.vest,
        cost: {
            resources: { wood: 10, iron: 45},
            time: time.ONE_HOUR,
        }
    },
};
export default armoursmithProduction;
