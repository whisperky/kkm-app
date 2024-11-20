/** @format */

import { config } from "dotenv";
config();
import express from "express";
import axios from "axios";
import { Telegraf } from "telegraf";
import { v2 as cloudinary } from 'cloudinary';

const app = express();
const port = process.env.PORT || 4000;

const {
  BOT_API_TOKEN: TELEGRAM_BOT_TOKEN,
  HOST_URL,
  NEXT_PUBLIC_APP_API_BASE_URL: BACKEND_URL,
  NEXT_PUBLIC_HOSTED_BOT_URL,
  CLOUD_NAME,
  CLOUD_KEY,
  CLOUD_SECRET,
} = process.env;
const USER_CREATION_ENDPOINT = `${BACKEND_URL}/user-service/users`;

const emojis = {
  sparkles: "✨",
  tada: "🎉",
  gameDie: "🎲",
  fire: "🔥",
  trophy: "🏆",
  rocket: "🚀",
  energy: "⚡️",
  coconut: "🥥",
};

// Replace with your actual credentials
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_KEY,
  api_secret: CLOUD_SECRET,
});


const gameImageURL =
  "https://www.kokomo.games/assets/Kokomo-games-C_v_d2aL.png";
const socialFiImageURL =
  "https://www.kokomo.games/assets/koko_phone-DqlVRn08.png";

const referrals = {};

bot.start(async (ctx) => {
  try {
    const username = ctx?.from?.username || ctx?.from?.first_name || "Player";
    const [type, code] = ctx?.message?.text?.split?.("_") || [];
    const userId = ctx?.from?.id;
    const [, typeKey] = `${type || ''}`.split(' ')
    const userPhotos = await ctx.telegram.getUserProfilePhotos(ctx.from.id);

    const fileId = userPhotos?.photos?.[0]?.at(-1)?.file_id;
    const file = fileId ? await ctx.telegram.getFile(fileId) : null;
    const photoUrl = file ? `https://api.telegram.org/file/bot${bot.token}/${file.file_path}` : '';

    console.log("refCode", code);
    console.log("Username", username);
    console.log("photoUrl", photoUrl);

    let result = {}
    if (photoUrl) {
      // Download the image
      const response = await axios.get(photoUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');

      // Upload to Cloudinary
      result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(buffer);
      });
    }

    let userData = null;

    try {
      const res = await axios.get(`${USER_CREATION_ENDPOINT}/${userId}`);
      userData = res?.data?.data?.user;
      console.log('typeKey =>', typeKey);
      console.log("Start User Info => ", userData);
    } catch (error) {
      if ([400, 404]?.includes(error?.response?.status))
        console.log("New user:", userId);
      else console.error("Error fetching user:", error);
    }

    try {
      if (!userData?.id) {
        await axios.post(USER_CREATION_ENDPOINT, {
          sessionId: ctx.from.id,
          username: ctx.from.username || "",
          photo_url: result?.secure_url || "",
          referrerSessionId: code || "",
        });
      } else {
        await axios.patch(`${USER_CREATION_ENDPOINT}/${ctx.from.id}`, {
          username: ctx.from.username || "",
          photo_url: result?.secure_url || "",
        });
        await axios.patch(`${BACKEND_URL}/game-service/users/${userId}`, {
          photo_url: result?.secure_url
        })
      }
    } catch (error) {
      console.error("Error Creating user:", error);
    }

    ctx.replyWithHTML(
      `Hey ${username}! 🏝️

<b>Hit Play Now to start your Koko journey.</b>

Compete to score the most points while working together to complete the Match by filling all One Million and One Kokos. But beware of sabotage! You can also uncheck already filled Kokos and refill them for yourself... 😈

<b>Rules?</b>
🟢 Score +1 point by tapping an empty box and filling it with a Koko. Your Kokos show as green. 
🔴 Other player Kokos show as red. If you tap a red Koko, the box empties and the person who originally filled that box loses -1 point. You can then refill it yourself for +1. This is called a <b>sabotage.</b>
💥 Streaks: earn bonus points for filling, or sabotaging, milestone amounts of Kokos. The first Streak bonus is achieved by filling/sabotaging 100 Kokos.

<b>Seasons</b>
There will be multiple Matches per Season of 1M1, with each Season introducing more and more game mechanics. Expect Leaderboards, Challenges and Teams. 

<b>Why?</b>
👀 Every point counts. <b>Your score will carry over</b> to other components of the Kokomo ecosystem.
🥥 Inviting friends won't go unnoticed. We don't forget to reward our most loyal Kokomons.
💎 And you can claim a <b>free Kokomo OG NFT</b> inside which unlocks future perks, benefits and rewards.

Trust us, you'll really want it.`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              typeKey == 'GI' ? {
                text: "🎮Play With Friend Now",
                web_app: {
                  url: `${HOST_URL}/1v1/waiting?inviteKey=${code}`,
                },
              } :
                {
                  text: "🎮Play Now",
                  web_app: {
                    url: `${HOST_URL}`,
                  },
                },
            ],
            [
              {
                text: "🥥Join the Community",
                url: "https://t.me/kokomo_games",
              },
            ],
            [
              {
                text: "🌴 Game Guide",
                callback_data: "game_guide",
              },
            ],
            // ...(isSuperTester
            //   ? [
            //       [
            //         {
            //           text: "💻 Add Tester",
            //           callback_data: "add_tester",
            //         },
            //         {
            //           text: "🗑 Remove Tester",
            //           callback_data: "remove_tester",
            //         },
            //       ],
            //       [
            //         {
            //           text: "📊 View Testers",
            //           callback_data: "view_testers",
            //         },
            //       ],
            //     ]
            //   : []),
          ],
        },
      },
    );

    if (code) {
      referrals[ctx.from.id] = code;
      console.log(`User ${ctx.from.id} referred by ${code}`);
    }
  } catch (error) {
    console.log(error);
  }
});

bot.action("game_guide", (ctx) => {
  ctx.answerCbQuery();
  ctx.replyWithHTML(
    `🌴 Koko Guide
  
Welcome to your Koko Journey!
  
Work together as a Community to fill Kokos by tapping, complete Matches, and progress through the 1M1 seasons while farming your points and growing your Koko score. Or untap, if you prefer to sabotage🥷

There will be multiple 1M1 Matches per Season. A Match ends when all Kokos are filled, at which point the board will be reset - meaning multiple opportunities to grow your scores. Each Season will introduce deeper game mechanics like Challenges, Missions, Leaderboards and Teams.  

Your performance in 1M1 won't go unnoticed, and neither will your social activity. The more, the better. 👀

<b>How to Play:</b>

<b>💥 Season 0: the base version of 1M1</b>
Tap empty boxes to earn points. Sabotage other players by unfilling their boxes and refilling them for yourself. 

🟢 Score +1 point by tapping an empty box and filling it with a Koko. Your Kokos show as green. 
🔴 Other player Kokos show as red. If you tap a red Koko, the box empties and the person who originally filled that box loses -1 point. You can then refill it yourself for +1. This is called a <b>sabotage.</b>
💥 Streaks: earn bonus points for filling, or sabotaging, milestone amounts of Kokos. The first Streak bonus is achieved by filling/sabotaging 100 Kokos.

<b>👥 Season 1 onwards</b>
Challenges, Leaderboards, Teams, and more. There will be multiple opportunities to farm points and grow your Koko score.

<b>Mint Your Free Kokomo OG NFT:</b>
  
📲 <b>Complete 3 social tasks</b> to claim <b>your free OG NFT</b>. This certifies your OG status, unlocking ongoing utility and future rewards.
  
🤫 <b>Hint: </b> Holding this NFT could be very beneficial when we launch other parts of our ecosystem. Remember, things carry over.

<b>Note:</b> There is a max supply of <b>rare Diamond OG NFTs</b>, available by WL only.

<b>Note2: Classic OG NFTs</b> will be available for any new player on an ongoing basis, but for a limited time only.

<b>Why Play 1M1?</b>:

👀 Every point counts. <b>Your score will carry over</b> to other components of the Kokomo ecosystem.
🥥 Inviting friends won't go unnoticed. We don't forget to reward our most loyal Kokomons.
💎 And you can claim a <b>free Kokomo OG NFT</b> inside which unlocks future perks, benefits and rewards.
  
Trust us, you'll really want it.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🎮Play Now",
              web_app: {
                url: `${HOST_URL}`,
              },
            },
          ],
          [
            {
              text: "🥥Join the Community",
              url: "https://t.me/kokomo_games",
            },
          ],
        ],
      },
    },
    {
      parse_mode: "HTML",
    },
  );
});

bot.action("add_tester", async (ctx) => {
  ctx.answerCbQuery();

  const askUsername = await ctx.reply(
    "Please enter the username of the tester:",
  );

  bot.on("text", async (textCtx) => {
    if (
      textCtx.message.reply_to_message &&
      textCtx.message.reply_to_message.message_id === askUsername.message_id
    ) {
      const username = textCtx.message.text;

      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/beta-tester/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        if (response.ok) {
          ctx.reply(`Tester ${username} has been successfully added!`);
        } else {
          ctx.reply(
            `Failed to add tester ${username}. Please try again later.`,
          );
        }
      } catch (error) {
        console.error("Error adding tester:", error);
        ctx.reply(
          "An error occurred while adding the tester. Please try again later.",
        );
      }

      bot.off("text");
    }
  });
});
bot.action("remove_tester", async (ctx) => {
  ctx.answerCbQuery();

  const askUsername = await ctx.reply(
    "Please enter the username of the tester:",
  );

  bot.on("text", async (textCtx) => {
    if (
      textCtx.message.reply_to_message &&
      textCtx.message.reply_to_message.message_id === askUsername.message_id
    ) {
      const username = textCtx.message.text;

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/beta-tester/remove`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
          },
        );

        if (response.ok) {
          ctx.reply(`Tester ${username} has been successfully removed!`);
        } else {
          ctx.reply(
            `Failed to remove tester ${username}. Please try again later.`,
          );
        }
      } catch (error) {
        console.error("Error removing tester:", error);
        ctx.reply(
          "An error occurred while removing the tester. Please try again later.",
        );
      }

      bot.off("text");
    }
  });
});

bot.action("leaderboard", (ctx) => {
  ctx.answerCbQuery();
  ctx.reply("Leaderboard coming soon! 🏆");
});

bot.command("gameinfo", (ctx) => {
  ctx.replyWithPhoto(gameImageURL, {
    caption: `<b>One Million and One Kokos Game Description:</b>\n\nA simple but addictive clicker game like Notcoin.\nUse your energy to click as fast as possible!\nRecharge your energy and keep clicking to the top! ${emojis.coconut}`,
    parse_mode: "HTML",
  });
});

bot.command("socialfi", (ctx) => {
  ctx.replyWithPhoto(socialFiImageURL, {
    caption: `<b>One Million and One Kokos SocialFi/Points System:</b>\n\n${emojis.trophy} Top Inviter Prizes!\n${emojis.energy} Earn points for inviting friends!\n👥 Share points with your friends!\n${emojis.fire} Top clicker of the day bonuses!\nAnd more...`,
    parse_mode: "HTML",
  });
});

app.get("/", (req, res) => {
  res.send("Telegram bot is running!");
});

// app.use(bot.webhookCallback("/secret-path"));
// bot.telegram.setWebhook(`${NEXT_PUBLIC_HOSTED_BOT_URL}/secret-path`);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("Bot is running" + emojis.rocket);
  bot.launch();
});
