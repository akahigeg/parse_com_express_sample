# Parse.comのHostingでexpressを動かすサンプル

## サンプルの起動方法

### ローカルの開発環境

    vagrant up
    vagrant ssh
    cd /vagrant/parse_web
    export PARSE_APP_ID=[your_parse_app_id]
    export PARSE_JS_KEY=[your_parse_app_javascript_key]
    export NODE_ENV=local_development
    supervisor cloud/app

### Parse.comへのデプロイ


## Parse.comに関するメモ

### Parse.comに関する分かりやすい概要資料

* http://www.slideshare.net/ktsujichan/5parsecom

### Hosting

* https://parse.com/docs/hosting_guide
* 静的ファイルをホスティングできる
  * アプリの公式サイトなど
* 動的処理もnode.js+expressで対応できる
  * ただしParse.com上で用意してある最低限のnpmしか使えないので厳しい
    * node_modulesにパスを通してやればいけるのかな？
  * expressのバージョンは3
  * 利用できるテンプレートエンジンはejsかjade


* global.jsonに関する記述

  * サンプルを置く
  * Hostingのアプリ内からglobal.jsonの記述を呼べないのかな？

     * 環境変数でおｋ
     * 環境変数の設定: http://qiita.com/hoshi-takanori/items/2128a6cf1dbb533379a2

  * global.jsonはgitに入れて、local.jsonをgitに入れないでそこにチェックインしたら不味い値とかを入れるようだ


   * Ansibleで開発環境を構築しよう

      * http://docs.ansible.com/playbooks_best_practices.html ベストプラクティス読もう

      * https://github.com/aenglund/nodejs-ansible これ使ってみよう


         * うまいこと動かなかった

      * ベストプラクティスに従おうとすると結局ファイルが多くなって見通し悪くなるような
      * ちょちょいっとしたものをちょちょいっと書けるのが魅力なのかな
      * 参考: https://blog.ymyzk.com/2014/05/debian-wheezy-hubot/

   * parse new MyWebSite

      * curl -s https://www.parse.com/downloads/cloud_code/installer.sh | sudo /bin/bash

      * sudo port select --set python python27

      * parse new MyWebSite
      * cd MyWebSite
      * echo"Hello World"> public/index.html

      * parse deploy
      * 参考: https://parse.com/docs/hosting_guide#started-installing
      * 管理画面のWebHostingでサブドメインを設定

         * CNAMEで独自ドメインから飛ばすこともできる

      * http://questmap.parseapp.com


   * parse generate express


      * MyWebSite内で実行
      * main.jsの編集
      * publicディレクトリを削除すれば全部動的にもできる

   * とにかくここ参考 https://parse.com/docs/hosting_guide


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
    * デバッグしにくい
* Cloud Module
  * 他サービスとの連携が可能なモジュール
  * Cloud Codeの中から使えるCloud Codeのフィーチャーの一部と言える





