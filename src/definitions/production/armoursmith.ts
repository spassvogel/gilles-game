import { Apparel } from "definitions/items/apparel";
import * as time from "utils/format/time";
import {  ProductionDefinition } from "./types";

// todo: real values for costs
const armoursmithProduction: { [key in Apparel]?: ProductionDefinition } = {
    "apparel/boots1": {
        item: "apparel/boots1",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
    },
    "apparel/boots2": {
        item: "apparel/boots2",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 2
    },
    "apparel/boots3": {
        item: "apparel/boots3",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 3
    },
    "apparel/chainmailHood": {
        item: "apparel/chainmailHood",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/chest": {
        item: "apparel/chest",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/clothGloves": {
        item: "apparel/clothGloves",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
    },
    "apparel/cowl": {
        item: "apparel/cowl",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/druidChest": {
        item: "apparel/druidHands",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 2
    },
    "apparel/druidFeet": {
        item: "apparel/druidFeet",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 2
    },
    "apparel/druidHands": {
        item: "apparel/druidHands",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 2
    },
    "apparel/druidHead": {
        item: "apparel/druidHead",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 2
    },
    "apparel/druidLegs": {
        item: "apparel/druidLegs",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
        levelRequired: 2
    },
    "apparel/fedora": {
        item: "apparel/fedora",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/greaves1": {
        item: "apparel/greaves1",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/greaves2": {
        item: "apparel/greaves2",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/hornedHelmet": {
        item: "apparel/hornedHelmet",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/leatherGloves": {
        item: "apparel/leatherGloves",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/nomadHelmet": {
        item: "apparel/nomadHelmet",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/pants1": {
        item: "apparel/pants1",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/pants2": {
        item: "apparel/pants2",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/plateChest1": {
        item: "apparel/plateChest1",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/plateChest2": {
        item: "apparel/plateChest2",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/plateChest3": {
        item: "apparel/plateChest3",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/plateChest4": {
        item: "apparel/plateChest4",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/plateGloves1": {
        item: "apparel/plateGloves1",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/plateGloves2": {
        item: "apparel/plateGloves2",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/plateHelmet": {
        item: "apparel/plateHelmet",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/platePants": {
        item: "apparel/platePants",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/plateShoulders1": {
        item: "apparel/plateShoulders1",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        }
    },
    "apparel/plateShoulders2": {
        item: "apparel/plateShoulders2",
        cost: {
            resources: {
                wood: 10,
                iron: 45
            },
            time: time.ONE_HOUR,
        },
    },
    "apparel/robe": {
        item: "apparel/robe",
        cost: {
            resources: { wood: 10, iron: 45},
            time: time.ONE_HOUR,
        }
    },
    "apparel/shoulders1": {
        item: "apparel/shoulders1",
        cost: {
            resources: { wood: 10, iron: 45},
            time: time.ONE_HOUR,
        }

    },
    "apparel/shoulders2": {
        item: "apparel/shoulders2",
        cost: {
            resources: { wood: 10, iron: 45},
            time: time.ONE_HOUR,
        }

    },
    "apparel/shoulders3": {
        item: "apparel/shoulders3",
        cost: {
            resources: { wood: 10, iron: 45},
            time: time.ONE_HOUR,
        }

    },
    "apparel/vest": {
        item: "apparel/vest",
        cost: {
            resources: { wood: 10, iron: 45},
            time: time.ONE_HOUR,
        }
    },
};
export default armoursmithProduction;
