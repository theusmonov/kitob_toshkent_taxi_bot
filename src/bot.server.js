import TelegramBot from "node-telegram-bot-api";
import "dotenv/config.js";

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, msg => {
    const { id, first_name } = msg.from;
    bot.sendMessage(id, `*Assalomu Alaykum* *${first_name}.* *Yo'lovchilar uchun xizmat ko'rsatuvchi botimizga xush kelibsiz!* 🙂\n\nBotning asosiy maqsadi. \n_Kitob ➡️ Toshkent | Toshkent ➡️ Kitob_ \n_Shaxrisabz ➡️ Toshkent_ \n_Toshkent ➡️ Shaxrisabz yo'lovchilari uchun xizmat ko'rsatishdir._\n\nMarhamat o'zingizga kerakli xizmat turini tanlashingiz mumkin!👇`, {
        parse_mode: 'Markdown',
        reply_markup: {
            keyboard: [
                [{text: "Yo'lovchi sifatida"}, {text: "Pochta yuborish"}],
                [{text: "Buyurtmalarim"}]
            ],
            resize_keyboard: true
        }
    });
});

bot.on("message", (msg) => {
    const {id} = msg.chat
    if(msg.text ==="Yo'lovchi sifatida"){
        bot.sendMessage(id, "Yo'lanishni tanlang!👇 \nQayerga bormoqchisiz?", {
            reply_markup: {
                keyboard: [
                    [{text: "Toshkent"}, {text: "Qashqadaryo"}],
                    [{text: "Orqaga ⬅️"}]
                ],
                resize_keyboard: true
            }
        })
    }
})
bot.on("message", (msg) => {
    const {id} = msg.chat
    if(msg.text === "Orqaga ⬅️")
    bot.sendMessage(id, "Marhamat o'zingizga kerakli xizmat turini tanlashingiz mumkin!👇",{
        reply_markup: {
            keyboard: [
                [{text: "Yo'lovchi sifatida"}, {text: "Pochta yuborish"}],
                [{text: "Buyurtmalarim"}]
            ],
            resize_keyboard: true
        }
    })
})

bot.on("message", (msg) => {
    const { id } = msg.chat;
    if (msg.text === "Toshkent" || msg.text === "Qashqadaryo") {
        bot.sendMessage(id, "Ismingizni yozing ✍️", {
            reply_markup: {
                remove_keyboard: true
            }
        }).then(() => {
            bot.once("message", (msg) => {
                const { id } = msg.chat;
                bot.sendMessage(id, "Telefon raqamingizni yuboring ✉️", {
                    reply_markup: {
                        keyboard: [[{ text: "Telefon raqamni yuborish", request_contact: true }]],
                        resize_keyboard: true
                    }
                });
            });
        });
    }
});







