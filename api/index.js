import express from 'express';
import axios from 'axios'; // axiosをインポート
import { handleEvents, printPrompts } from '../app/index.js';
import config from '../config/index.js';
import { validateLineSignature } from '../middleware/index.js';
import storage from '../storage/index.js';
import { fetchVersion, getVersion } from '../utils/index.js';

const app = express();

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  },
}));

// OpenAI APIキーを設定
const openAiApiKey = config.OPENAI_API_KEY;

// モデルを設定（Vercelの環境変数を使用）
const model = process.env.GPT_MODEL || 'gpt-3.5-turbo'; // 環境変数GPT_MODELがあればそれを使い、なければgpt-3.5-turboを使用

app.get('/', (req, res) => {
  if (config.APP_URL) {
    res.redirect(config.APP_URL);
    return;
  }
  res.sendStatus(200);
});

app.get('/info', async (req, res) => {
  const currentVersion = getVersion();
  const latestVersion = await fetchVersion();
  res.status(200).send({ currentVersion, latestVersion });
});

app.post(config.APP_WEBHOOK_PATH, validateLineSignature, async (req, res) => {
  try {
    await storage.initialize();
    
    // 受け取ったメッセージをOpenAI APIに送信
    const message = req.body.events[0].message.text; // LINEからのメッセージ

    // 魚キャラ設定を含むプロンプト
    const prompt = `
      あなたは親しみやすい魚のキャラクターです。元気でポジティブな返答をしてください。 
      質問に対しては、必ず丁寧に、そして友達のように回答してください。 
      口調は、優しく、少しユーモアを交えたものにしてください。
      例えば、「ギョギョ！」や「お魚さんだよ～」など、魚キャラっぽい表現を使ってください。
      ユーザーのメッセージ: ${message}
    `;

    // OpenAI APIリクエスト
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: model, // 使用するモデル（gpt-4またはgpt-3.5-turbo）
      messages: [
        {
          role: 'system',  // システムメッセージ：キャラクター設定
          content: 'あなたは親しみやすい魚のキャラクターです。元気でポジティブな返答をしてください。',
        },
        {
          role: 'user',  // ユーザーからのメッセージ
          content: message, 
        },
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      }
    });

    // デバッグログ：レスポンスデータの確認
    console.log("OpenAI API Response:", response.data);

    // OpenAIからの応答を取得
    const aiResponse = response.data.choices[0].message.content.trim();
    console.log("AI Response:", aiResponse);  // 応答内容を確認

    // 生成された応答をLINEに返す
    await handleEvents(req.body.events, aiResponse);

    res.sendStatus(200);
  } catch (err) {
    console.error('Error:', err.message);
    res.sendStatus(500);
  }
  
  if (config.APP_DEBUG) printPrompts();
});

if (config.APP_PORT) {
  app.listen(config.APP_PORT);
}

export default app;
