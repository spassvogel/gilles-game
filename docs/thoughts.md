27/4/2019
[x] display a log on the lower part of the screen.
  each log entry has a type: (common, quest, warning)
  can be plain text now. later to be replaced by keys that
  can be filtered (will be filtered default on the quest when a quest is clicked)

[ ] for ease, a party can only exist when a quest is combined with a group of adventurers
  its not possible to create a party and send them on a quest later
  the party gets created when the adventurers leave on the quest
  the quest has an icon, that will be the icon for the party too

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

[ ] The tavern has a limited number of vacancies (rooms). Upgrading the tavern upgrades this number.
[ ] Periodically new adventurers will take residence
    The tavern will only accept new adventurers when there are rooms free.
    Adventurers on quests keep their rooms
[ ] You can kick out an adventurer that's not on a quest. Freeing the room. 
[ ] Quests are launched from the 'quest board' in the tavern. 
[ ] You can train workers/citizens to become adventurers


02/05/2019 TRAITS

[ ] During encounters, characters can receive certain traits. These can be beneficial or not. In some cases the traits can be healed, removed etc. Some items can be used to grant a trait to an adventurer.

23/06/2019 HELP
[ ] Each screen should get a contexualized help window