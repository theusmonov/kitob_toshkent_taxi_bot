import TelegramBot from "node-telegram-bot-api";
import "dotenv/config.js";

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, msg => {
    const { id, first_name } = msg.from;
    bot.sendMessage(id, `*Assalomu Alaykum* *${first_name}.* *Yo'lovchilar uchun xizmat ko'rsatuvchi botimizga xush kelibsiz!* 🙂\n\nBotning asosiy maqsadi. \n_Kitob ➡️ Toshkent | Toshkent ➡️ Kitob_ \n_Shaxrisabz ➡️ Toshkent_ \n_Toshkent ➡️ Shaxrisabz yo'lovchilari uchun xizmat ko'rsatishdir._\n\nMarhamat o'zingizga mos xizmat turini tanlashingiz mumkin!👇`, { parse_mode: 'Markdown' });
});
