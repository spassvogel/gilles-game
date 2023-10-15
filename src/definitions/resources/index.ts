export enum Resource {
  wood = 'wood',
  iron = 'iron',
  stone = 'stone',
  leather = 'leather',
  fabric = 'fabric',
  food = 'food',
}

export type ResourceDefinition = {
  resource: Resource
  iconImg: string
}

const all = {
  [Resource.wood]: {
    resource: Resource.wood,
    iconImg: '/img/resources/wood.png'
  },
  [Resource.iron]: {
    resource: Resource.iron,
    iconImg: '/img/resources/iron.png'
  },
  [Resource.stone]: {
    resource: Resource.stone,
    iconImg: '/img/resources/stone.png'
  },
  [Resource.leather]: {
    resource: Resource.leather,
    iconImg: '/img/resources/leather.png'
  },
  [Resource.fabric]: {
    resource: Resource.fabric,
    iconImg: '/img/resources/fabric.png'
  },
  [Resource.food]: {
    resource: Resource.food,
    iconImg: '/img/resources/food.png'
  }
}

export default all
