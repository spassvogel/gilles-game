import { AdventurerAction } from "./adventurers";
import { GameAction } from "./game";
import { GoldAction } from "./gold";
import { LogAction } from "./log";
import { QuestAction } from "./quests";
import { ResourcesAction } from "./resources";
import { StructuresAction } from "./structures";
import { TaskAction } from "./tasks";
import { WorkersAction } from "./workers";

export type Action = AdventurerAction | GameAction | GoldAction | LogAction | QuestAction | ResourcesAction | StructuresAction | TaskAction | WorkersAction