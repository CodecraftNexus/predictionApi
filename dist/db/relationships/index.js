"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRelationship = initRelationship;
const User_1 = require("./User");
const BirthLocation_1 = require("./BirthLocation");
const Gender_1 = require("./Gender");
function initRelationship(models) {
    (0, BirthLocation_1.initBirthLocationRelationship)(models);
    (0, Gender_1.initGenderRelationship)(models),
        (0, User_1.initUserRelationship)(models);
}
