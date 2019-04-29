27/4/2019
[ ] display a log on the lower part of the screen.
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

USE as such:

import itemDefinitions from "src/definitions/items";
import * as Handlebars from "handlebars";

const source = "You have found a {{item:name foundItem}}";
var template = Handlebars.compile(source);
Handlebars.registerHelper('item:name', (item) => {
    if (!itemDefinitions[item]){ 
        return new Handlebars.SafeString(`<<ITEM DEFINITION NOT FOUND: ${item}>>`);
    }
    const name = itemDefinitions[item].name;
    return new Handlebars.SafeString(name);
});

const output = template({foundItem: 'sword'});
console.log(output)

Make a localization file as such:

{ 'found-item': "You have found a {{item foundItem}}" }

[x] compile the templates and store them by key
[x] allow for precompilation and JIT, pass by ctor, default = true
[ ] add 'clear' method to TextManager for testing purposes. will set initialized to false


[ ] multi langual structures
[ ] multi langual resources
[ ] for simplicity, don't change the names of the structures as they level up
[ ] add 'unique' optional prop to item
[ ] add 'articleDefined', 'articleUndefined' optional props to item
[ ] add 'common-article-defined': 'the', 'common-article-undefined': 'a' to language file
[ ] add helper for article, undefined, defined and auto. investigate if we can do this: "item foundItem aA", "item foundItem aU" etc
    will see if 'articleDefined' or 'articleUndefined' is declared, if not, will use 'common-article..'
    auto will investigate the 'unique' property. if true use defined, otherwise undefined
[x] have a helper for 'capital' Capitalise

[ ] The tavern has a limited number of vacancies (rooms). Upgrading the tavern upgrades this number.
    The tavern will only accept new adventurers when there are rooms free.
    Quests are launched from the 'quest board' in the tavern. Adventurers on quests keep their rooms
