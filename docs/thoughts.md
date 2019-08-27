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

29/07/2019 EQUIP EQUIPMENT
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
