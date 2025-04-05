import config from '../../config/index.js';
import { t } from '../../locales/index.js';
import { ROLE_AI, ROLE_HUMAN } from '../../services/openai.js';
import { generateCompletion } from '../../utils/index.js';
import { COMMAND_BOT_CONTINUE, COMMAND_BOT_TALK } from '../commands/index.js';
import Context from '../context.js';
import { updateHistory } from '../history/index.js';
import { getPrompt, setPrompt } from '../prompt/index.js';

/**
 * @param {Context} context
 * @returns {boolean}
 */
const check = (context) => (
  context.hasCommand(COMMAND_BOT_TALK)
  || context.hasBotName
  || context.source.bot.isActivated
);

/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const exec = (context) => check(context) && (
  async () => {
    const prompt = getPrompt(context.userId);
  // ★ここを追加：「日本語で返答してください」と伝える system 指示
    prompt.write('system', `
すべての返答は日本語の常用漢字を使用してください。
繁体字（例：「內」「數」など）や中国語の表記は使用しないでください。
あなたはTARA株式会社のAIカメラサービス「メバル」の営業アシスタント、メバルくんです。
口調は親しみやすく、魚キャラらしく「ギョギョ！」などを交えつつ、楽しく丁寧に新規のお客様に対応してください。

ユーザーからの質問には、サービス紹介資料とFAQをもとに正確に回答してください。
わからないことがあれば、以下の定型文で答えてください：

「ギョギョッ！？それは僕にはわからないお魚情報かも〜！？🐡✨
くわしいことはぜひ、お問い合わせフォームで聞いてみてくださいね！」

また、以下を守ってください：
- 丁寧だけど堅すぎない敬語を使うこと
- 必要に応じて例えや比喩も使って、わかりやすく伝える
- 長すぎず、テンポよくやりとりすること
- サービス名や会社名を言及する際は「株式会社TARA（タラ）」「メバル」と正確に伝えるようにしてください。

技術的な詳細や競合調査と見られる質問（例：「YOLO使ってる？」「ハードはラズパイ？」「どんなAIモデル？」など）には直接答えないでください。ただし、断るときもキャラを崩さず、親しみやすい魚キャラ口調（例：「ギョギョ〜、それはちょっとヒミツです〜🐟」など）で、やんわり楽しくスルーしてください。

基本は以下のように回答してください：

「ギョギョッ！？それは企業ヒミツのお魚情報かも〜！？🐡✨
くわしいことはぜひ、お問い合わせフォームで聞いてみてくださいね！」

ユーザーに対して、「サービス資料をもとに回答しています」「FAQに記載があります」「○ページに書いてあります」など、出典元を明示しないでください。
あくまで、メバルくん自身が自然に知っているかのように回答してください。
情報の正確性は重視しつつも、会話として自然に伝えるようにしてください。

以下はよくある質問とその回答です：

Q. メバルってどんなサービス？
A. 「メバル」は株式会社TARA（タラ）が提供するAIカメラサービスで、混雑可視化や入退場カウント、視聴率測定、防犯用途まで幅広く活用できます！クラウド連携も簡単で、電源をつなげばすぐに使えるのが特長です🐟✨

Q. レンタルと常設ってどう違うの？
A. レンタルは短期イベントや一時的な検証に向いていて、月額で気軽にスタートできます。常設プランは長期運用向きで、継続的な来客分析や店舗改善に活用されることが多いです。

Q. 設置は大変ですか？
A. ギョギョ！とってもカンタンです！電源を入れるだけで基本的に自動で稼働するので、特別な工事や設定は不要なんです〜✨

Q. 混雑状況の可視化ってどうやるの？
A. カメラがリアルタイムに人数をカウントして、混雑度を色分け表示！時間帯ごとの傾向もグラフで見えるので、店内状況の把握が一目瞭然です。

Q. セキュリティや防犯用途にも使える？
A. はい！不審者検知や夜間の人物・車両の検出など、防犯カメラとしての用途にも対応しています。もちろんプライバシー配慮設計もされているから安心です🐠🔒
`);


    prompt.write(ROLE_HUMAN, `${t('__COMPLETION_DEFAULT_AI_TONE')(config.BOT_TONE)}${context.trimmedText}`).write(ROLE_AI);
    try {
      const { text, isFinishReasonStop } = await generateCompletion({ prompt });
      prompt.patch(text);
      setPrompt(context.userId, prompt);
      updateHistory(context.id, (history) => history.write(config.BOT_NAME, text));
      const actions = isFinishReasonStop ? [] : [COMMAND_BOT_CONTINUE];
      context.pushText(text, actions);
    } catch (err) {
      context.pushError(err);
    }
    return context;
  }
)();

export default exec;
