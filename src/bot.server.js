import TelegramBot from "node-telegram-bot-api";
import "dotenv/config.js";

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});


let userMalumot = {}

bot.onText(/\/start/, msg => {
    const {id, first_name} = msg.from;
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
    if (msg.text === "Yo'lovchi sifatida") {
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
    if (msg.text === "Orqaga ⬅️")
        bot.sendMessage(id, "Marhamat o'zingizga kerakli xizmat turini tanlashingiz mumkin!👇", {
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
        userMalumot["Borish manzili"] = msg.text;
        bot.sendMessage(id, "Ismingizni yozing ✍️", {
            reply_markup: {
                remove_keyboard: true
            }
        }).then(() => {
            bot.once("message", (msg) => {
                const { id } = msg.chat;
                userMalumot["Ismi"] = msg.text.trim();
                bot.sendMessage(id, "Telefon raqamingizni yuboring, yoki aloqa uchun boshqa raqamni junatmoqchi bo'lsangiz uni yozing. Namuna: +998900010290 ✉️", {
                    reply_markup: {
                        keyboard: [[{ text: "Telefon raqamni yuborish", request_contact: true }]],
                        resize_keyboard: true
                    }
                }).then(() => {
                    bot.once("message", (msg) => {
                        const { id } = msg.chat;
                        if (msg.contact) {
                            userMalumot["Telefon"] = msg.contact.phone_number;
                        } else {
                            const telefonRaqami = msg.text.trim();
                            if (/^\+998\d{9}$/.test(telefonRaqami)) {
                                userMalumot["Telefon"] = telefonRaqami;
                            } else {
                                bot.sendMessage(id, "Raqam yuborishda xatolik mavjud, masalan, +998901234567");
                                return;
                            }
                        }
                        let malumotString = "";
                        for (const key in userMalumot) {
                            if (userMalumot.hasOwnProperty(key)) {
                                malumotString += `${key}: ${userMalumot[key]}\n`;
                            }
                        }
                        bot.sendMessage(id, `Ma'lumotlar:\n${malumotString}`, {
                            reply_markup: {
                                remove_keyboard: true
                            }
                        });
                    });
                });
            });
        });
    }
});




