import { EnemyDefinition, EnemyType } from "./types";
import trolls from "./trolls";

const all = {
  ...trolls,
};

export default all;
export function getDefinition(enemy: EnemyType): EnemyDefinition {
  return all[enemy] as unknown as EnemyDefinition;
}
