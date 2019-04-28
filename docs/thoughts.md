27/4/2019
* display a log on the lower part of the screen.
  each log entry has a type: (common, quest, warning)
  can be plain text now. later to be replaced by keys that
  can be filtered (will be filtered default on the quest when a quest is clicked)

* for ease, a party can only exist when a quest is combined with a group of adventurers
  its not possible to create a party and send them on a quest later
  the party gets created when the adventurers leave on the quest
  the quest has an icon, that will be the icon for the party too

* for multi lingual support we need a templating engine
  it needs to support dynamic lookups. such as
  "you found a {item.name:sword}"
  but also:
  "you found a {item.name:{context:item}}"
  where we provide a context object { item: sword }