# tfd-front
東京消防庁フロント

### Verision
```
Node v12.22.12
npm 10.4.0
yarn 1.22.5
```

### API
* AWS Ec2 i-0ddcab3b2a456dedd(3.115.92.29)
* https://github.com/CTIE-TOKYO-MIZU/tfd

### setup
```
git clone https://github.com/CTIE-TOKYO-MIZU/tfd-front.git
cd tfd-front
yarn install
```
### local debug
```
・DB接続
sudo ssh -i ../../.ssh/CTI-Riskma.pem -L 29000:docdb-tfdmetro.cluster-cqj9d1qyehxx.ap-northeast-1.docdb.amazonaws.com:27017 -N ec2-user@3.112.121.178

・tfd（API）をローカル実行
yarn express

・以下のファイルを作成
/src/config/current.config.js
module.exports = {
  current: "production",
  custom:{
    apiServer: {
      url: "http://localhost:3000"
    }
  }
};

・コマンド実行
yarn serve
```
### deploy
```
・以下のファイルを作成
/src/config/current.config.js
module.exports = {
  current: "production",
};

・以下のコマンドを実行
yarn build

・SFTPで 3.115.92.29に接続
/home/ec2-user/tfd/distを更新
```
