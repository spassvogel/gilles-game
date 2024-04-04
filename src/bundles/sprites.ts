export const sprites = {
  actors: {
    ELF_BOW: 'img/scene/actors/elf-bow.json',
    KNIGHT_SPEAR: 'img/scene/actors/knight-spear.json',
    KNIGHT_SWORD: 'img/scene/actors/knight-sword.json',
    ORC_AXE: 'img/scene/actors/orc-axe.json',
    SKELETON: 'img/scene/actors/skeleton.json',
    TROLL_AXE: 'img/scene/actors/troll-axe.json',
    TROLL_SWORD: 'img/scene/actors/troll-sword.json'
  },
  town: {
    CLOUD_1: 'img/town/clouds/cloud-01.png',
    CLOUD_2: 'img/town/clouds/cloud-02.png',
    CLOUD_3: 'img/town/clouds/cloud-03.png',
    EFFECT_SMOKEPARTICLE: 'img/town/effects/smokeparticle.png',
    BACKGROUND: 'img/town/town-alpha/background.png',
    STRUCTURE_ALCHEMIST: 'img/town/town-alpha/alchemist.png',
    STRUCTURE_ARMOURSMITH: 'img/town/town-alpha/armoursmith.png',
    STRUCTURE_GARDEN: 'img/town/town-alpha/garden.png',
    STRUCTURE_LUMBER_MILL: 'img/town/town-alpha/lumberMill.json',
    STRUCTURE_MINE: 'img/town/town-alpha/mine.png',
    STRUCTURE_QUARRY: 'img/town/town-alpha/quarry.png',
    STRUCTURE_TANNERY: 'img/town/town-alpha/tannery.png',
    STRUCTURE_TAVERN: 'img/town/town-alpha/tavern.png',
    STRUCTURE_WAREHOUSE: 'img/town/town-alpha/warehouse.png',
    STRUCTURE_WEAPONSMITH: 'img/town/town-alpha/weaponsmith.png',
    STRUCTURE_WEAVER: 'img/town/town-alpha/weaver.png',
    STRUCTURE_WORKSHOP: 'img/town/town-alpha/workshop.png',
    STRUCTURELABEL_BACKGROUND: 'img/town/structure-label/background.png',
    STRUCTURELABEL_BORDER: 'img/town/structure-label/border-top.png'
  },
  world: {
    MAP_DEFAULT: 'img/world/map-default.png',
    MAP_MARKER: 'img/world/map-marker.png',
    MAP_MARKER_SELECTED: 'img/world/map-marker-selected.png',
    QUEST_ALERT: 'img/world/quest-alert.png'

  }
}

export type SceneSprite = keyof typeof sprites[keyof typeof sprites]
