import { Optional } from "sequelize";

export interface UserAttributes {
  id: string;
  name: string;
  email: string;
  genderId: string;
  birth_location_id: string;
  dateOfBirth?: Date | null;
  birthTime?: string | null;
  hashPassword?: string | null;
  username?: string | null;
  WhatsappNumber?: string | null;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  | "id"
  | "email"
  | "name"
  | "dateOfBirth"
  | "birthTime"
  | "hashPassword"
  | "username"
  | "WhatsappNumber"
>;

export interface BirthLocationAttributes {
  id: string;
  name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export type BirthLocationCreationAttributes = Optional<
  BirthLocationAttributes,
  "id" | "latitude" | "longitude" | "name"
>;

export interface GenderAttributes {
  id: string;
  type?: string | null;
}

export type GenderCreationAttributes = Optional<
  GenderAttributes,
  "id" | "type"
>;


export interface RefreshTokenAttributes {
  id: string;
  userId: string;
  tokenHash: string; // sha256(token)
  expiresAt: Date;
  revoked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RefreshTokenCreationAttributes = Optional<
  RefreshTokenAttributes,
  "id" | "revoked" | "createdAt" | "updatedAt"
>;


export interface OAuthAccountAttributes {
  id: string;
  userId: string;
  provider: string;
  providerId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  metadata?: Record<string, any> | null;
}

export type OAuthAccountCreationAttributes = Optional<
  OAuthAccountAttributes,
  "id" | "accessToken" | "refreshToken" | "metadata"
>;


export interface ApiKeyAttributes {
  id: string;
  key: string;
}

export type ApiKeyCreationAttributes = Optional<ApiKeyAttributes, "id">;

export interface PalentHouseAttributes {
  id: string;
  userId: string;
  lagnaya: string;
  box1?: string | null;
  box2?: string | null;
  box3?: string | null;
  box4?: string | null;
  box5?: string | null;
  box6?: string | null;
  box7?: string | null;
  box8?: string | null;
  box9?: string | null;
  box10?: string | null;
  box11?: string | null;
  box12?: string | null;
}

export type PalentHouseCreationAttributes = Optional<PalentHouseAttributes, "id" | "box1" | "box2" | "box3" | "box4" | "box5" | "box6" | "box7" | "box8" | "box9" | "box10" | "box11" | "box12">;



export interface DashaBalanceAttributes {
  id: string;
  userId: string;
  dashawa: string;
  To: string,
  From: string
}

export interface antharDashaBalanceAttributes {
  id: string;
  userId: string;
  anthardhashawa: string
  setNo: string,
  From: string,
  To: string

}



export interface sunPredictionAttributes {
  id: string;
  userId: string;
  general_prediction: string
  personalised_prediction: string,
  verbal_location: string,
  planet_zodiac_prediction: string

}
export  interface EducationqualificationsCategoryAttributes {
  id : string;
  CategoryName : string;
}

export interface EducationqualificationsItemAttributes {
  id : string
  EducationqualificationsCategoryId : string;
  qualificationsName : string;
}

export interface EducationqualificationsAttributes {
  id : string;
  EducationqualificationsItemId : string;
  userId : string;
}
 


export  interface JobsCategoryAttributes {
  id : string;
  CategoryName : string;
}

export interface JobsItemAttributes {
  id : string
  JobCategoryId : string;
  JobsName : string;
}

export interface JobsAttributes {
  id : string;
  JobItemId : string;
  userId : string;
}
 



