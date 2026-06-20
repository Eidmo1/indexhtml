/**
 * 1gram Telegram Mini App Bot Script
 *
 * This is a complete, production-ready Telegram Bot script written in Node.js
 * using the 'node-telegram-bot-api' library.
 *
 * How to use:
 * 1. Install dependencies in your project or server:
 *    npm install node-telegram-bot-api dotenv
 * 
 * 2. Create a .env file on your server (or set environment variables):
 *    TELEGRAM_BOT_TOKEN=your_bot_token_here
 *    MINI_APP_URL=https://ais-pre-nf4gv27co65hpmzmzl6mif-975096618449.europe-west2.run.app
 * 
 * 3. Run the bot:
 *    node telegram-bot.js
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Retrieve configurations from environment variables
const token = process.env.TELEGRAM_BOT_TOKEN || '6900000000:AAH_XXXXXXXXXXXXX_XXXXX'; // Replace with your Bot Token from @BotFather
const webAppUrl = process.env.MINI_APP_URL || 'https://ais-pre-nf4gv27co65hpmzmzl6mif-975096618449.europe-west2.run.app'; // Your Web App URL

if (!token || token.startsWith('6900000000')) {
  console.warn("⚠️ Warning: Please replace the placeholder TELEGRAM_BOT_TOKEN with your actual bot token.");
}

// Create a bot that uses polling to fetch new updates
const bot = new TelegramBot(token, { polling: true });

console.log('🚀 1gram Telegram Bot is running successfully...');

// Listen for the /start command
bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name || 'User';
  
  // Extract custom payload (e.g. referral payload "ref_123456")
  const startPayload = match[1] || '';
  let referralCode = '';
  
  if (startPayload && startPayload.startsWith('ref_')) {
    referralCode = startPayload.replace('ref_', '');
  }

  // Construct the direct Web App URL with referral parameters if present
  let launchUrl = webAppUrl;
  if (referralCode) {
    launchUrl += `?start=ref_${referralCode}`;
  }

  // Welcome message in Arabic (Since your user segment is mostly Arabic-speaking)
  const arabicWelcomeText = `
👋 أهلاً بك يا ${msg.from.first_name} في بوت *1gram TON*!

💰 شاهد الإعلانات والمهام اليومية واكسب عملات TON الحقيقية بشكل فوري ومباشر!

👥 نظام الإحالات:
قم بدعوة أصدقائك واكسب هدايا ونسب مئوية على شكل عملات رقمية.

👇 اضغط على الزر أدناه لفتح التطبيق والبدء في كسب الأرباح فوراً:
`;

  // Welcome message in English
  const englishWelcomeText = `
👋 Welcome ${msg.from.first_name} to *1gram TON* Bot!

💰 Watch ads, perform simple daily tasks, and earn real TON coins instantly!

👥 Referral System:
Invite your friends and earn direct commissions for every task they complete!

👇 Click the button below to launch the Mini App and start earning now:
`;

  // Inline keyboard incorporating the WebApp button
  const opts = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🚀 ابدأ الأرباح والمهام | Open App',
            web_app: { url: launchUrl }
          }
        ],
        [
          {
            text: '📢 قناة الدعم والتحديثات',
            url: 'https://t.me/OneGramTonUpdates' // Replace with your updates channel url if you have one
          }
        ]
      ]
    }
  };

  try {
    await bot.sendMessage(chatId, arabicWelcomeText, opts);
    
    // Log referral link use on console for server tracking
    if (referralCode) {
      console.log(`👤 User ${username} (${chatId}) entered via referral code: ${referralCode}`);
    } else {
      console.log(`👤 User ${username} (${chatId}) started the bot.`);
    }
  } catch (error) {
    console.error('❌ Error sending Telegram welcome message:', error.message);
  }
});

// Generic fallbacks or help messages
bot.on('message', async (msg) => {
  const text = msg.text || '';
  if (text.startsWith('/start')) {
    return; // Already handled by the onText action
  }
  
  const chatId = msg.chat.id;
  const replyText = `
💡 للبدء واستخدام التطبيق، يرجى النقر على زر "ابدأ الأرباح والمهام" من القائمة أدناه، أو أرسل /start مجدداً.

💡 To start gathering rewards, click the "Open App" button on your screen or send /start again.
`;

  await bot.sendMessage(chatId, replyText, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🚀 ابدأ كسب الأرباح | Open App',
            web_app: { url: webAppUrl }
          }
        ]
      ]
    }
  });
});
