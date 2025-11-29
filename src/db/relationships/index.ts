import { initUserRelationship } from "./User";
import { initBirthLocationRelationship } from "./BirthLocation";
import { initGenderRelationship } from "./Gender";

export function initRelationship(models : Record<string,any>){
    initBirthLocationRelationship(models);
    initGenderRelationship(models),
    initUserRelationship(models);
}

