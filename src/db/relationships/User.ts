export function initUserRelationship(models: Record<string, any>) {
  const { User , RefreshToken ,OAuthAccount , PalentHouse ,DashaBalance ,AntharDasha , PredictionSun} = models;
  if (!User) return;

    if (OAuthAccount) {
    OAuthAccount.belongsTo(User, { foreignKey: "user_id" });
    User.hasMany(OAuthAccount, { foreignKey: "user_id" });
  }

  if (RefreshToken) User.hasMany(RefreshToken , {
    foreignKey: "userId"
  })


  
    if (PalentHouse) {
    User.hasMany(PalentHouse, { foreignKey: "userId" });
  }

     if (DashaBalance) {
    User.hasMany(DashaBalance, { foreignKey: "userId" });
  }

    if (AntharDasha) {
    User.hasMany(AntharDasha, { foreignKey: "userId" });
  }

  if(PredictionSun){
    User.hasMany(PredictionSun , {foreignKey: "userId" })
  }

}
