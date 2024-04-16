// 以下設定３つの一つだけ残してcurrent.config.jsonを作成する：
/***************************************
 * developmentの場合：この行は削除してね
 ***************************************/
module.exports = {
  current: "development",
  // 追加およびオーバーライトの部分を記述する
  custom:{
    apiServer: {
      url: "http://localhost:3000/"  // 例：諸域値のApiは開発環境からlocalhostに切り替え可能
    }
  }
};

/***************************************
 * stagingの場合：この行は削除してね
 ***************************************/
module.exports = {
  current: "staging"
};

/***************************************
 * productionの場合：
 ***************************************/
module.exports = {
  current: "production"
};

/***************************************
 * サーバ設定依存(連動)するの場合：
 ***************************************/
module.exports = {
  current: require("../../srv/configure/current.config").current
};
