export const staticFaqMap = [
  {
    question: "機能について教えて",
    answer: `ギョギョッ！「メバル」の機能についてですね〜！🐟✨
とっても多機能なお魚…いえ、AIカメラなんです！
ざっくり機能別にまとめると、こんなことができます！

🎥【入退場・入店カウント】
入場数・退場数・滞在人数をリアルタイムでカウント！
属性（性別・年齢など）の分析もオプションで対応可能です。

🚶【交通量調査】
歩行者・自転車・車などを方向別にカウントできます。

👥【混雑状況可視化】
人数をカメラでカウントし、リアルタイムの混雑度を表示！

🚗【駐車場混雑可視化】
駐車中の車をカウントして空き情報を可視化します。

⏱️【視聴者数調査】
立ち止まり時間で“視聴者”を推定！広告効果なども測れます。

🚨【迷惑行為検知】
立入禁止エリアの侵入を検知してアラート通知！

その他、📺サイネージ表示、📈レポートカスタムなどにも対応！
`
  },
  {
    question: "導入の流れを教えて",
    answer: `ギョギョッ！導入の流れですね〜！🐟✨

① お申し込み・情報登録  
・会社情報や設置予定場所を記入いただきます  
・このタイミングで利用審査も行います  

② 電子契約のご案内（クラウドサイン）  
・メールで契約書をお送りします  
・Web上で内容確認し、同意ボタンで完了です  

③ セットアップシートのご記入  
・設置方角や稼働時間、Wi-Fi情報などを入力いただきます  

④ お支払い手続き  
・クレジットカードまたは請求書払いが選べます  

⑤ カメラの発送・設置  
・最短2週間（お急ぎ便なら3営業日）で発送します！  
・電源を挿すだけ、工事ナシでも使えます  

⑥ データ取得スタート！  
・管理画面IDが発行され、すぐにデータ確認できます

全国対応の設置工事サービスもあるのでご安心を🐡`
  },
  {
    question: "メバルを始めるのに必要なものを教えて",
    answer: `ギョギョッ！ありがとうございます〜🐡✨

「メバル」は、基本的に【電源】だけあればOK！
レンタルプランにはカメラ、解析機器、SIM通信まで全て入っているので、特別なネット回線は不要です！

📦 同梱内容の一例：
・AIカメラ本体
・解析機器（ラズパイ等）
・SIM付き通信機器
・電源アダプタ
・設置用金具やケーブル類

つまり、届いたら電源に挿すだけ！すぐに使えるお手軽さが魅力です🐟`
  },
  {
    question: "概算費用を教えて",
    answer: `ギョギョ！ご質問ありがとうございます🐟✨

メバルの費用は【利用方法】と【期間】によって異なります。

📦 レンタル or 🏠 常設導入？  
🧭 用途は？（例：混雑可視化・交通量調査など）  
📆 期間は？（例：2週間・1か月・3か月）

ざっくりで構いませんので、ご希望をお聞かせいただければ最適なプランをご提案します🎣`
  },
  {
    question: "サービス名の由来は？",
    answer: `ギョギョ〜！名前の由来ですね🐟✨

「メバル」は、お魚の「メバル（目張）」から着想を得た名前です。

👁️ 視力がよく、暗闇でも見える魚 → AIカメラの特性とマッチ！  
🔍「見張る（メバル）」＝ 見守り・監視の意味もかけています！  
💡 名前は可愛いけど中身は本格派！  
・人物・車両の高精度検知  
・入退場／属性／混雑分析  
・クラウド連携でいつでも確認可能！

それが、**株式会社TARA**の「メバル」なんです🐠✨`
  }
];

export const getStaticFaqAnswer = (userMessage) => {
  const trimmed = userMessage.trim().toLowerCase();
  for (const faq of staticFaqMap) {
    if (faq.question.toLowerCase() === trimmed) {
      return faq.answer;
    }
  }
  return null;
};
