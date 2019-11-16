backlog of ideas

27/4/2019 LOG
[x] display a log on the lower part of the screen.
    each log entry has a type: (common, quest, warning)
    can be plain text now. 
[x] later to be replaced by keys that
    can be filtered (will be filtered default on the quest when a quest is clicked)
[x] Quest logs are added to this log
[x] for ease, a party can only exist when a quest is combined with a group of adventurers
    its not possible to create a party and send them on a quest later
    the party gets created when the adventurers leave on the quest
[ ] the quest has an icon, that will be the icon for the party too

27/4/2019 Multi lingual support
[x] for multi lingual support we need a templating engine
    it needs to support dynamic lookups. such as
    "you found a {item.name:sword}"
    but also:
    "you found a {item.name:{context:item}}"
    where we provide a context object { item: sword }
[x] compile the templates and store them by key
[x] allow for precompilation and JIT, pass by ctor, default = true
[ ] add 'clear' method to TextManager for testing purposes. will set initialized to false

28/4/2019
[x] multi langual structures
[x] multi langual resources
[x] for simplicity, don't change the names of the structures as they level up
[x] add 'unique' optional prop to item
[ ] add 'articleDefined', 'articleUndefined' optional props to item
[ ] add 'common-article-defined': 'the', 'common-article-undefined': 'a' to language file
[ ] add helper for article, undefined, defined and auto. investigate if we can do this: "item foundItem aA", "item foundItem aU" etc
    will see if 'articleDefined' or 'articleUndefined' is declared, if not, will use 'common-article..'
    auto will investigate the 'unique' property. if true use defined, otherwise undefined
[x] have a helper for 'capital' Capitalise

[x] The tavern has a limited number of vacancies (rooms). Upgrading the tavern upgrades this number.
[ ] Periodically new adventurers will take residence
    The tavern will only accept new adventurers when there are rooms free.
    Adventurers on quests keep their rooms
[ ] You can kick out an adventurer that's not on a quest. Freeing the room. 
[x] Quests are launched from the 'quest board' in the tavern. 
[ ] You can train workers/citizens to become adventurers


02/05/2019 TRAITS
[ ] During encounters, characters can receive certain traits. These can be beneficial or not. 
[ ] In some cases the traits can be healed, removed etc. 
[ ] Some items can be used to grant a trait to an adventurer.

23/06/2019 HELP
[ ] Each screen should get a contexualized help window
[ ] HTML elements can receive a 'data-help' attribute with a key to refer to the localisation file

30/06/2019 GAME TICK QUEST UPDATE
[x] Move gameTick from quest reducer into 'controllers'

07/07/2019 STRUCTURE UPGRADE TIME
[ ] Upgrading a structure takes time

07/07/2019 GAME DESIGN: warehouse
[ ] Is the warehouse limited? Can you add unlimited items?
[x] Resource capacity is limited
[ ] Warehouse produces 'food rations' for quests

10/07/2019 ASSERTS
[ ] Include an assert library

10/07/2019 GAME TICK RESOURCE
[x] Move add resource into 'controllers'
[ ] Move the guard around maxResources to the reducer (but it needs access to the level of the warehouse to determine maxresources)
    https://stackoverflow.com/questions/34333979/accessing-other-parts-of-the-state-when-using-combined-reducers

10/07/2019 GAME DESIGN: minimum workers on item craft
[ ] Perhaps each item can have a number of minimum workers?

12/07/2019 GAME DESIGN: quest prerequisites/ resource sink
[ ] The quests should have some sort of resource cost. 
    However we don't want weapons to break all the time.
    Are the items consumed straight away?
    Ideas:
[ ] Sharp weapons can get more dull if used more. Dull blades do way less damage. Craft whetstones from stone and use on the weapon to sharpen again.
[ ] Weapons slowly lose durability (/health) when used. 
[ ] Weapons can either be repaired ?  OR : just disassembled for a fraction of the crafting cost

13/07/2019 EQUIPMENT REQUIREMENTS
[ ] Equipment (=apparel+weapons) can have stats requirements (e.g. a minimum amount of STR)

14/07/2019 ROUTER
[x] Implement react router for town/world
[ ] Implement react router for structures
[ ] Can go to resource production structure directly from warehouse

14/07/2019 XP Progression 
[ ] https://stackoverflow.com/questions/6954874/php-game-formula-to-calculate-a-level-based-on-exp
[ ] or find RPG framework
[ ] XP should have diminishing returns on weaker enemies
    research: wow?

14/07/2019 Rooms of tavern
[x] figure out how amount of rooms is determined. perhaps by level?

15/07/2019 GAME DESIGN: Party speed
[ ] The speed in which the party progresses in a quest could be determined by the party itself. Perhaps the slowest member?

15/07/2019 CHORE: host on github?
[x] Maybe I can host this stuff on github pages. (https://github.com/gitname/react-gh-pages)
[x] Probably best to start a new `create-react-app`.

20/07/2019 contextual popup
[x] the contextual info should just pop up over the item that you have clicked

20/07/2019 open popups
[x] popups can be opened using withAppContext

20/07/2019 quest view
[ ] shows latest log message when not in encounter

22/07/2019 OBJECTIVES
[ ] we could have objectives as a type of achievement / tutorial kinda thing. players would learn about the game
    and get rewarded when they complete an objective

23/06/2019 POPUPS CAN FLIP
[ ] popups should try to position themselves and if there is no space, flip

24/06/2019 BUTTON COMPONENTS
[ ] buttons should get their own react component.
[ ] first identify the different button types

25/07/2019 SCROLLING TABS
[ ] Tabbar could be scrollable
[ ] Scrollbar should be on top
    https://stackoverflow.com/questions/18997724/how-to-change-scroll-bar-position-with-css

25/07/2019 CUSTOM CURSORS
[ ] We need cursors for move and not-allowed

29/07/2019 EQUIP GEAR
[x] Can equip gear from the players inventory
[ ] Can equip gear from the warehouse

  head                hands
  shoulders            legs
  chest                feet
  mainhand  offhand sidearm

31/07/2019 THREE.js
Because I'm not an artist and I want to use unity3d assets
[ ] First check if components dont get remounted too much. If yes, find out why and resolve issue!     
[ ] Find cool fantasy town assets
[ ] Check if can be loaded in threejs (seperate project)
[ ] Implement in town
[ ] It would be cool to have the town scrollable. (see: 23/08/2019 WORLD MAP)
    The easiest way would maybe to be to create a very long canvas, render everything on it and let the browser scroll this canvas. This way you also have a scrollbar.
    Not optimal for performance tho.
[ ] Find cool fantasy character unity asset packs
[ ] Check if can be loaded in threejs (seperate project)
[ ] Implement in combat
    perhaps we don't need react bindings.
    See if we can do this:
    1. on mount, all actors are spawned and positioned
    2. on update, all actors (AIs turn happens simultanously?) move to their new positions
       and play their animations.
[ ] On second hand, I think it's worth checking out react-three-fiber. Might get complicated otherwise  


04/08/2019 Swap items between warehouse and adventurers
[x] Take items from warehouse and assign to adventurer inventory
[ ] Take items from warehouse and assign to adventurer gear

08/08/2019 Combat
Still haven't figured out a combat game system. But can implement some ground work. 
Want to store the combat state in the store as such:
combat: {
    actors: [{
        allegiance: "player|enemy",
        location: [2,1],
        health: 10,
        actionPoints: 3,
    }],
    turn: "player",
    action: {
        type: "move|shoot|..."
        actor: "actorId",
        target: { location: [6,3] }
        actionEndsAt: time
    }
}

During combat each actor has a nr of AP. They can spend this in a few ways:

- MOVE ( forward 1 AP, backward 2 AP, sidewards 2 AP)
- TURN (1 AP)
- USE WEAPON (depends on weapon type, ex:
        * sword: thrust*, slash
        * dgger: thrust*, cut
        * spear: thrust*, throw
        * bow:   aim, fire)
- SWITCH (main/sidearm)
- CHANGE stance (kneeling, standing)
- SHIELD UP (lowers chance to hit with weapon)
- JUMP over obstabcles?
- USE inventory items?

*) thrusting does more damage than regular attack but leaves an actor 'overextended', meaning they can't parry or dodge.


! In general, ranged does less dmg than melee but is often safer.

research: different weapon types and their strenghts and weaknesses

[ ] body area hit could be stochastic now:
    - head:  0.1
    - torso: 0.4
    - hands: 0.1
    - legs:  0.3
    - feet:  0.1
[ ] later allow for aimed hits

COMBAT SEQUENCE

[ ] When attacking, first roll to hit. Weapon skill determines hit or miss. For ranged, a distance penalty applies. Also cover bonus can be in effect.
[ ] research: how does weapon skill work? does it include STR?
    can it increasy by time?
    let's assume for now we fix it to a value

[ ] Defender rolls to dodge. Dodge% is in effect at equal level. Otherwise penalty applies, eg 10% per level difference

[ ] If dodge fails can try to block with shield or parry with weapon. IF succesful will deflect all dmg but cause shield/weapon integrity to go down.

[ ] If not blocked or parried, part of damage is absorbed by armour (if the actor is wearing any).
   A helmet with armor rating 20 absorbs 20 dmg of each hit.
[ ] Armours integrity goes down. In general more than if would be blocked or parried.

EFFECTS
in combat these effects should be checked all the time, they are modifiers for various things

enum EffectType { attack, passive, ... }
enum EffectResultType { fireDamage, ... }

interface Effect {
    effectType: EffectType,
    condition?: (source, target, combat) => boolean,
    resultType: EffectResultType,
    value: any (can be function)
    duration?: number,
    charges?: number
}

eg: "+20 fire dmg to undead" {
  effectType: attack,
  condition: (source, target, combat) => target.race == undead
  resultType: fireDmg
  value: 20
}

We can render game as ascii art for now using a PRE tag

[ ] Some tiles on the combat map offer cover. Cover works in all directions.

23/8/2019 ADVENTURER STATS

base and (secondary stats) are:
- STRength (melee attack)
- STAmina (carry, hitpoints)
- AGIlity (dodge, amount of AP)
- INTelligence (perception?)

[x] todo: find GURPS basic set: characters

[ ] each weapon / armor has a STR requirement
[ ] shields and weapons have a integrity property (1-0) when it reaches 0 it breaks

23/08/2019 WORLD MAP
[ ] World map is paneable by dragging. Can feature a compass that always points to the town
[ ] Research: three.js controls (https://threejs.org/examples/misc_controls_map.html)
    http://danni-three.blogspot.com/2013/09/threejs-heightmaps.html

23/08/2019 THEME
todo: figure out a cool theme,
research fantasy concept art

24/08/2019 NAMING
[x] come up with a better name for worn equipment, (perhaps 'apparel')
[x] refactor into the following structure: 
    EQUIPMENT = { APPAREL, WEAPONS }

17/11/2019 STORE WORLD POS
[ ] store world pos in redux, pass to WorldMap.scrollToPosition
read:  https://barkofthebyte.azurewebsites.net/post/2014/05/05/three-js-projecting-mouse-clicks-to-a-3d-scene-how-to-do-it-and-how-it-works