import { sequelize } from "./sequelize";
import * as models from "./models";

export const db = {
    sequelize,
    ...models,
}