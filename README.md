# Parse.comのHostingでexpressを動かす

## まず読む

* https://parse.com/docs/hosting_guide

進めていくうちに詰まったら再度よく読む。

## ローカルの開発環境を作る

修正のたびにいちいちparse deployして動作確認やテストをするのは厳しいのでVagrantを使ってローカルに環境を作る。

Cloud Codeの開発にも応用できるはず。

### Vagrantの準備

Mac上で

    vagrant box add debian74 http://opscode-vm-bento.s3.amazonaws.com/vagrant/virtualbox/opscode_debian-7.4_chef-provisionerless.box
    vagrant up

必要に応じて

    vagrant provision
    vagrant ssh

ProvisionはAnsible

### expressの起動の準備

Vagrantで立ち上げたホストでexpressのディレクトリに行ってnpm install

    cd /vagrant/parse_web/cloud
    npm install

### expressの起動

    cd /vagrant/parse_web
    export PARSE_APP_ID=[your_parse_app_id]
    export PARSE_JS_KEY=[your_parse_app_javascript_key]
    export NODE_ENV=local_development
    supervisor cloud/app

PARSE_APP_IDとPARSE_JS_KEYはglobal.jsonの`applicationId`と`masterKey`にあたるもの。
ローカルではglobal.jsonは読まれないので環境変数として指定する。

NODE_ENVはローカルとParse.com上でモジュールのロードパスを変えたりするための条件分岐に使用。

### 動作確認

http://192.168.33.10:3000/items/index

動かない場合はログから原因を確認して対処。

### ローカルで動いてもParse.com上で動かないことがままある

なので開発中こまめにparse deployした方が良い。

よくある理由は次のようなもの

* Parse.com上ではnpmが使えない
* 自作モジュールのロードパスが違う等々

npmが使えないので複雑なウェブアプリを作るならHerokuなど別のホスティングを検討した方が良い。
または検索エンジンのインデックスが必要なければBackbone.jsのようなクライアントサイドのフレームワークで対応するという選択もある。

## Parse.comへのデプロイ

### Parse.comのコマンドラインツールのインストール

Mac上で。Vagrant上からでも多分OKかな？

    curl -s https://www.parse.com/downloads/cloud_code/installer.sh | sudo /bin/bash
    sudo port select --set python python27

Python3系では動かないので注意。

### global.jsonの作成

[global.json.sample](https://github.com/akahigeg/parse_com_express_sample/blob/edit-readme/parse_web/config/global.json.sample)を元に作成する。

    cd parse_web/config
    cp global.json.sample global.json

`applicationId`と`masterKey`を自分で作成したParse Appのものに修正する。

### デプロイ

これはMac上から。Vagrant上からでも多分OK？

    cd /vagrant/parse_web
    parse deploy

### 動作確認

管理画面のWebHostingでサブドメインを設定して

http://[xxx].parseapp.com/items/index

動かない場合は管理コンソールのログで原因を確認

https://www.parse.com/apps/[xxx]/cloud_code/log

## Parse.comに関するメモ

### Parse.comに関する分かりやすい概要資料

* http://www.slideshare.net/ktsujichan/5parsecom

### Hosting

* https://parse.com/docs/hosting_guide
* 静的ファイルをホスティングできる
  * アプリの公式サイトなど
* 動的処理もnode.js+expressで対応できる
  * ただしParse.com上で用意してある最低限のnpmしか使えないので厳しい
    * node_modulesにパスを通してやればいけるのかな？ => いけたけどちゃんと全ての機能が上手く動いてるかわからん
  * expressのバージョンは3
  * 利用できるテンプレートエンジンはejsかjade
  * 自前のソースのモジュール化は可能なので、npmもソースをコピーしてrequireのパスなどを少しいじればいけるかも
* Backbone.jsなどのクライアントサイドで動的処理を行う手もあり
* 管理画面のWebHostingでサブドメインを設定
  * CNAMEで独自ドメインから飛ばすこともできる

### Cloud Code周りについて

* Cloud Code
  * node.jsで書く
    * Parse.comのJavaScriptのSDKを使うかんじ　https://parse.com/docs/js_guide
  * Cloud Function
    * どのアプリからでも共通で使えるサーバーサイド処理
    * Parse.Clund.defineで定義してParse.Could.runで簡単に呼べる
    * 15秒以上かかる処理はkill
    * Hostingで実装するのとの違い
      * http経由ではなくSDK経由で呼び出す
      * HostingからもCloud Functionは呼べる
  * Running Code On
    * Saveなどのフィルターはどの種類のデバイスやアプリからアクセスしても共通のbeforeSaveなどの処理を適用できるメリットがある
    * 3秒以上かかる処理はkill
    * RDBMSにおけるトリガーにイメージは似てる
  * Background Job
    * 15分以上かかると強制終了
    * 20req/sの制限あり この制限を超えると強制終了 
    * 管理画面からスケジューリングできる
  * Custom Webhooks
    * 他のウェブサービスなどからアクセスするためのエンドポイントを作成する
      * JSON以外のデータが欲しいとき
      * Parse.comの提供するREST APIでは用が足りないとき
    * Hostingのnode.jsで自前実装するのと変わらない？
       * 不特定多数がアクセスする前提のHosting
       * 自分の管理するアプリやウェブサービスのみからアクセスする前提のWebhooks
       * ってかんじじゃないだろうか
     * ベーシック認証かけられるのでかけた方がいい
  * Cloud Codeの難点
    * npmが使えない
    * ローカルでテストできない
      * Hostingのexpress上で同じロジックを書いてローカルで開発し、上手く動くようになったらCloud Codeにして微調整するのがいいと思う
    * デバッグしにくい
* Cloud Module
  * 他サービスとの連携が可能なモジュール
  * Cloud Codeの中から使えるCloud Codeのフィーチャーの一部と言える





