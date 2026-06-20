import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";

// Simple diagnostic logging function to write to a workspace file we can view
function logBotDiagnostic(message: string) {
  const logPath = path.join(process.cwd(), "telegram_bot_debug.log");
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  try {
    fs.appendFileSync(logPath, logMessage);
  } catch (err) {
    console.error("Failed to write to bot debug log:", err);
  }
}

export function initTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  // Use the active shared preview URL as primary fallback if MINI_APP_URL is not set
  const webAppUrl = process.env.MINI_APP_URL || "https://ais-pre-nf4gv27co65hpmzmzl6mif-975096618449.europe-west2.run.app";

  logBotDiagnostic("Initializing Telegram Bot...");

  if (!token) {
    logBotDiagnostic("⚠️ [Telegram Bot] TELEGRAM_BOT_TOKEN is not configured in the secrets settings.");
    return;
  }

  logBotDiagnostic(`Using token starting with: ${token.substring(0, 10)}...`);
  logBotDiagnostic(`Using WebApp URL: ${webAppUrl}`);

  try {
    // Create bot in polling mode
    const bot = new TelegramBot(token, { polling: true });
    logBotDiagnostic("🚀 [Telegram Bot] Bot constructor called successfully.");

    // Handle bot events and errors
    bot.on("polling_error", (error: any) => {
      logBotDiagnostic(`❌ [Telegram Bot] Polling Error: ${error.message} (Code: ${error.code})`);
      if (error.message && error.message.includes("409")) {
        logBotDiagnostic("💡 Conflict Error (409): Another instance or bot script is already running with this token. Please make sure no other bot is active.");
      }
    });

    bot.on("error", (error: any) => {
      logBotDiagnostic(`❌ [Telegram Bot] General Error: ${error.message}`);
    });

    // Listen for the /start command which also can carry deep link referral payload
    bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
      const chatId = msg.chat.id;
      const userNameRaw = msg.from?.first_name || "User";
      // Escape HTML special characters for the user name to prevent parse errors
      const userName = userNameRaw
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const usernameLog = msg.from?.username ? `@${msg.from.username}` : userNameRaw;
      
      logBotDiagnostic(`Received /start from user: ${usernameLog} (${chatId})`);

      // Extract custom payload (e.g. referral payload "ref_123456")
      const startPayload = match ? (match[1] || "") : "";
      let referralCode = "";
      
      if (startPayload && startPayload.startsWith("ref_")) {
        referralCode = startPayload.replace("ref_", "");
      }

      // Construct the direct Web App URL with referral parameters if present
      let launchUrl = webAppUrl;
      if (referralCode) {
        launchUrl += `?start=ref_${referralCode}`;
      }

      // Welcome message in Arabic - using HTML for robust and crash-free formatting
      const arabicWelcomeText = `👋 أهلاً بك يا <b>${userName}</b> في بوت <b>1gram TON</b>!

💰 شاهد الإعلانات والمهام اليومية واكسب عملات TON الحقيقية بشكل فوري ومباشر!

👥 <b>نظام الإحالات:</b>
قم بدعوة أصدقائك واكسب هدايا ونسب مئوية على شكل عملات رقمية.

👇 اضغط على الزر أدناه لفتح التطبيق والبدء في كسب الأرباح فوراً:`;

      // Inline keyboard containing the WebApp button
      const opts = {
        parse_mode: "HTML" as const,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 ابدأ الأرباح والمهام | Open App",
                web_app: { url: launchUrl }
              }
            ],
            [
              {
                text: "📢 قناة الدعم والتحديثات",
                url: "https://t.me/OneGramTonUpdates"
              }
            ]
          ]
        }
      };

      try {
        await bot.sendMessage(chatId, arabicWelcomeText, opts);
        logBotDiagnostic(`🎉 Sent welcome message successfully to ${chatId}`);
        if (referralCode) {
          logBotDiagnostic(`[Telegram Bot] User ${usernameLog} (${chatId}) joined with referral: ${referralCode}`);
        } else {
          logBotDiagnostic(`[Telegram Bot] User ${usernameLog} (${chatId}) started the bot.`);
        }
      } catch (error: any) {
        logBotDiagnostic(`❌ [Telegram Bot] Error sending welcome message: ${error.message}`);
      }
    });

    // Default message handler for other text messages
    bot.on("message", async (msg) => {
      const text = msg.text || "";
      if (text.startsWith("/start")) {
        return; // Handled above
      }
      
      const chatId = msg.chat.id;
      logBotDiagnostic(`Received generic message from ${chatId}: "${text}"`);

      const replyText = `💡 للبدء واستخدام التطبيق، يرجى النقر على زر "ابدأ الأرباح والمهام" من القائمة أدناه، أو أرسل /start مجدداً.

💡 To start gathering rewards, click the "Open App" button on your screen or send /start again.`;

      try {
        await bot.sendMessage(chatId, replyText, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🚀 ابدأ كسب الأرباح | Open App",
                  web_app: { url: webAppUrl }
                }
              ]
            ]
          }
        });
        logBotDiagnostic(`🎉 Sent generic reply successfully to ${chatId}`);
      } catch (error: any) {
        logBotDiagnostic(`❌ [Telegram Bot] Error sending fallback message: ${error.message}`);
      }
    });

    logBotDiagnostic("🚀 [Telegram Bot] Event listeners attached. Bot is listening!");

  } catch (error: any) {
    logBotDiagnostic(`❌ [Telegram Bot] Failed to initialize bot: ${error.message}`);
  }
}
