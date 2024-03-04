import TelegramBot from "node-telegram-bot-api";
import "dotenv/config.js";

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, {polling: true});


let userMalumot = {}

bot.onText(/\/start/, msg => {
    const {id, first_name} = msg.from;
    bot.sendMessage(id, `*Assalomu Alaykum* *${first_name}.* *Yo'lovchilar uchun xizmat ko'rsatuvchi botimizga xush kelibsiz!* 🙂\n\nBotning asosiy maqsadi. \n_Kitob ➡️ Toshkent | Toshkent ➡️ Kitob_ \n_Shaxrisabz ➡️ Toshkent_ \n_Toshkent ➡️ Shaxrisabz yo'lovchilari uchun xizmat ko'rsatishdir._\n\nMarhamat o'zingizga kerakli xizmat turini tanlashingiz mumkin!👇`, {
        parse_mode: 'Markdown', reply_markup: {
            keyboard: [[{text: "Yo'lovchi sifatida"}, {text: "Pochta yuborish"}], [{text: "Buyurtmalarim"}]],
            resize_keyboard: true
        }
    });
});

bot.on("message", (msg) => {
    const {id} = msg.chat
    if (msg.text === "Yo'lovchi sifatida") {
        bot.sendMessage(id, "Yo'lanishni tanlang!👇 \nQayerga bormoqchisiz?", {
            reply_markup: {
                keyboard: [[{text: "Toshkent"}, {text: "Qashqadaryo"}], [{text: "Orqaga ⬅️"}]], resize_keyboard: true
            }
        })
    }
})
bot.on("message", (msg) => {
    const {id} = msg.chat
    if (msg.text === "Orqaga ⬅️") bot.sendMessage(id, "Marhamat o'zingizga kerakli xizmat turini tanlashingiz mumkin!👇", {
        reply_markup: {
            keyboard: [[{text: "Yo'lovchi sifatida"}, {text: "Pochta yuborish"}], [{text: "Buyurtmalarim"}]],
            resize_keyboard: true
        }
    })
})


bot.on("message", (msg) => {
    const {id} = msg.chat;
    if (msg.text === "Toshkent" || msg.text === "Qashqadaryo") {
        userMalumot[`Borish manzili`] = msg.text;
        bot.sendMessage(id, "Ismingizni yozing ✍️", {
            reply_markup: {
                remove_keyboard: true
            }
        }).then(() => {
            bot.once("message", (msg) => {
                const {id} = msg.chat;
                userMalumot[`Ismi`] = msg.text.trim();
                bot.sendMessage(id, "Telefon raqamingizni yuboring, yoki aloqa uchun boshqa raqamni junatmoqchi bo'lsangiz uni yozing. Namuna: +998900010290 ✉️", {
                    reply_markup: {
                        keyboard: [[{text: "Telefon raqamni yuborish", request_contact: true}]], resize_keyboard: true
                    }
                }).then(() => {
                    bot.on("message", (msg) => {
                        const {id} = msg.chat;
                        if (msg.contact) {
                            userMalumot[`Telefon`] = msg.contact.phone_number;
                            nechtaInson(id)
                        }
                    });
                })
            });
        });
    }
});

function nechtaInson(id) {
    bot.sendMessage(id, "Siz bir o'zingizmisiz yoki hamrohingiz bormi? \nNechi kishi ekanligingizni raqam bilan belgilang. \nO'zingiz bo'lsangiz 1 raqamini yuboring 😊", {
        reply_markup: {
            keyboard: [[{text: "1"}, {text: "2"}], [{text: "3"}, {text: "4"}]],
            resize_keyboard: true
        }
    })
}

bot.on("message", (msg) => {
    const {id} = msg.chat;
    if (msg.text === "1" || msg.text === "2" || msg.text === "3" || msg.text === "4") {
        userMalumot[`Nechi kishi`] = msg.text;
        bot.sendMessage(id, "Javob uchun rahmat! \n\nQaysi sana va vaqtda ketmoqchisiz yozib jo'nating. \nNamuna: 04.04.2024, 13:00", {
            reply_markup: {
                remove_keyboard: true
            }
        }).then(() => {
            bot.once("message", (msg) => {
                userMalumot['Ketish vaqti va kuni'] = msg.text;
                bot.sendMessage(id, "Lokatsiyani jo'natishni bosing: \nSizni qayerdan olib ketishsin. \n\nTelefon gps qurilmasi yoqilganda siz turgan hozirgi manzil avtomatik jo'natiladi, yoki bo'lmasa boshqa manzilni belgilab  jo'nating ", {
                    reply_markup: JSON.stringify({
                        keyboard: [[{text: 'Location Request', request_location: true}],],
                        resize_keyboard: true,
                        one_time_keyboard: true,
                    })
                }).then(() => {
                    bot.once("location", (msg) => {
                        const latitude = msg.location.latitude;
                        const longitude = msg.location.longitude;
                        userMalumot['Olib ketish manzili 👇'] = `\n\n(https://www.google.com/maps?q=${latitude},${longitude})`;
                        let malumotString = "";
                        for (const key in userMalumot) {
                            if (userMalumot.hasOwnProperty(key)) {
                                malumotString += `*${key}*: ${userMalumot[key]}\n`
                            }
                        }
                        bot.sendMessage(id, `*Ma'lumotlar to'g'rimi? ha yoki yo'q tugmasini bosing. *\n\n${malumotString}`, {
                            parse_mode: "Markdown",
                            reply_markup: {
                                keyboard: [
                                    [{text: "Ha"}, {text: "Yo'q"}]
                                ],
                                resize_keyboard :true
                            }
                        }).then(() => {
                            bot.on("message", (msg) => {
                                const {id} = msg.chat
                                if(msg.text === "Ha"){
                                    bot.sendMessage(id,"Buyurtma haydovchilar guruhiga jo'natildi", {
                                        reply_markup: {
                                            remove_keyboard:  true
                                        }
                                    })
                                } else {
                                    bot.sendMessage(id,"Buyurtma bekor qilindi!", {
                                        reply_markup: {
                                            remove_keyboard:  true
                                        }
                                    })
                                }
                            })
                        })
                    })
                })
            });
        });
    }
});












