import {User} from "./User"
import { initHooks } from "../hooks";
import { BirthLocation } from "./BirthLoacation";
import { Gender } from "./Gender";
import { RefreshToken } from "./RefreshToken";
import { initRelationship } from "../relationships";
import { OAuthAccount } from "./OAuthAccount";
import { ApiKey } from "./ApiKey";
import { PalentHouse } from "./PlanetHouse";
import { DashaBalance } from "./DashaBalance";
import { AntharDasha } from "./AntharDasha";
import { sunPrediction } from "./PredictionSun";


const models = {
    User,
    BirthLocation,
    Gender,
    RefreshToken,
    OAuthAccount,
    ApiKey,
    PalentHouse,
    DashaBalance,
    AntharDasha,
    sunPrediction
};

initHooks(models);
initRelationship(models);

export { 
    User,
    BirthLocation,
    Gender,
    RefreshToken,
    OAuthAccount,
    ApiKey,
    PalentHouse,
    DashaBalance,
    AntharDasha,
    sunPrediction
}


