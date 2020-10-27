import { Resource } from "definitions/resources";
import { ONE_MINUTE } from 'utils/format/time';

export const RESOURCE_INTERVAL = ONE_MINUTE; // every minute constitutes a resource tick.

// Whenever a list of resource is shown, use this order
export const resourceOrder = [
    Resource.food,
    Resource.wood,
    Resource.iron,
    Resource.stone,
    Resource.fabric,
    Resource.leather,
];
