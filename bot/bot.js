/** @format */

import { config } from "dotenv";
config();
import express from "express";
import axios from "axios";
import { Telegraf } from "telegraf";

const app = express();
const port = process.env.PORT || 6000;

const {
  BOT_API_TOKEN: TELEGRAM_BOT_TOKEN,
  HOST_URL,
  NEXT_PUBLIC_APP_API_BASE_URL: BACKEND_URL,
} = process.env;
const USER_CREATION_ENDPOINT = `${BACKEND_URL}/user-service/users`;
const GLACIER_API_URL =
  "https://glacier-api.avax.network/v1/chains/43114/addresses";

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

/**
 * Fetch NFTs for a given wallet address using the Glacier API.
 * @param {string} walletAddress - The wallet address to fetch NFTs for.
 * @returns {Promise<Array>} - Returns a promise with an array of NFT details.
 */
async function fetchNftsForWallet(walletAddress) {
  const url = `${GLACIER_API_URL}/${walletAddress}/balances:listErc721`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = response.data;

      if (data.erc721TokenBalances) {
        return data.erc721TokenBalances.map((nft) => ({
          name: nft.name || "Unknown",
          tokenId: nft.tokenId || "Unknown",
          contractAddress: nft.contractAddress || "Unknown",
        }));
      } else {
        console.log("No ERC-721 token balances found for this wallet.");
        return [];
      }
    } else {
      console.error(
        `Failed to fetch NFTs: ${response.status} - ${response.statusText}`
      );
      throw new Error("Failed to fetch NFTs.");
    }
  } catch (error) {
    console.error("Error fetching NFTs:", error.message);
    throw error;
  }
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

const gameImageURL =
  "https://www.kokomo.games/assets/Kokomo-games-C_v_d2aL.png";
const socialFiImageURL =
  "https://www.kokomo.games/assets/koko_phone-DqlVRn08.png";

const referrals = {};

// Decode invite key
export function decodeInviteKey(key) {
  if (!key || typeof key !== "string") {
    console.error("Invalid key provided to decodeInviteKey:", key);
    return { createdAt: null, originalKey: key, sessionId: null };
  }

  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  function fromBase62(str) {
    if (!str || typeof str !== "string") {
      console.error("Invalid input for fromBase62:", str);
      return 0;
    }

    return str
      .split("")
      .reduce((prev, curr) => prev * 62 + chars.indexOf(curr), 0);
  }

  const [, timestampPart, data] = key.split("-");
  const timestamp = fromBase62(timestampPart);
  const date = new Date(timestamp);

  const sessionId = data ? fromBase62(data) : "";

  return {
    createdAt: date,
    originalKey: key,
    sessionId,
  };
}

// Function to ensure "1v1" and "NFT Help" always work
async function sendNftHelp(ctx, type) {
  try {
    // Step 1: Extract the User ID
    const userId = ctx.from.id;

    // Step 2: Fetch NFT Data using the User ID
    const nftResponse = await axios.get(
      `https://kokomogames.com/api/v1/nft-service/nft/airdrop/all?size=10&start=0&sessionId=${userId}`
    );

    // Step 3: Extract Data
    const nftData = nftResponse.data.data.data;

    if (!nftData || nftData.length === 0) {
      await ctx.reply("No NFTs found for your account.");
      return;
    }

    console.log(nftData);
    console.log(type);

    // Step 4: Retrieve Wallet Address from the Response
    const walletAddress = nftData[0]?.walletAddress;

    if (!walletAddress) {
      await ctx.reply("No wallet address associated with your account.");
      return;
    }

    // Step 5: Fetch Specific NFT Data Based on Type
    let specificNfts;
    let contractAddress;

    if (type === "welcome") {
      specificNfts = await findSpecificNfts(walletAddress, {
        name: " Kokomo Welcome Collectible",
      });
      contractAddress = "0xDfD70334de54E30E532a2836d5D4A7C849245D45";
    } else if (type === "OG") {
      specificNfts = await findSpecificNfts(walletAddress, {
        name: "Kokomo Classic OG",
      });
      contractAddress = "0x9cE96704a5F5AA60A2F8e2A87bb54ec82BecBaab";
    } else {
      await ctx.reply("Invalid NFT type specified.");
      return;
    }

    if (!specificNfts || specificNfts.length === 0) {
      await ctx.reply(`No specific NFTs found for the type: ${type}.`);
      return;
    }

    console.log(specificNfts[0][0]);
    // Extract the first NFT ID (or process multiple if needed)
    const tokenId = specificNfts[0].tokenId;

    if (!tokenId) {
      await ctx.reply("No valid NFT ID found for your account.");
      return;
    }

    console.log(`NFT ID: ${tokenId}`);
    console.log(`Type: ${type}`);

    // Step 6: Respond with Type-Specific Help Message
    if (type === "welcome") {
      await sendWelcomeNftHelp(ctx, tokenId, contractAddress);
    } else if (type === "OG") {
      await sendOgNftHelp(ctx, tokenId, contractAddress);
    }
  } catch (error) {
    console.error("Error fetching NFTs:", error.message);
    await ctx.reply(
      "An error occurred while fetching your NFTs. Please try again later."
    );
  }
}

async function sendWelcomeNftHelp(ctx, tokenId, contractAddress) {
  const message = `<b><i>If you entered a MetaMask address:</i></b>
1️⃣ Open your wallet and change network to 'Avalanche Network C-Chain'
2️⃣ Go to your NFTs, and look for 'Import NFT'
3️⃣ Enter the details below:
<b>Contract Address:</b> ${contractAddress}
<b>Token ID:</b> ${tokenId}

*<i>*Sometimes Avalanche NFTs don't show in MetaMask mobile. This is a MetaMask issue - check on MetaMask browser or OpenSea to see your Kokomo NFT!</i>*

<b><i>If you entered a Rabby Wallet address:</i></b>
1️⃣ Open your wallet and go to the activity tab: 🕒
2️⃣ Look for the correct mint transaction: 📜 mint ${contractAddress.slice(
    0,
    5
  )}…${contractAddress.slice(-4)}
3️⃣ Click the green text to the right of the small NFT icon: + 1 #x

<b><i>If you want to view your NFT in OpenSea:</i></b>
1️⃣ Go to opensea.io and log-in by connecting the wallet you used to mint
2️⃣ Go to your OpenSea profile
3️⃣ If you can't see your Kokomo NFT, press More and click Hidden. Then move it out of there!

If you still need further support, join us in our Early Kokomons chat: @early_kokomons`;

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "🎮 Play 1M1",
          url: "https://t.me/One_Million_One_bot/game_on",
        },
      ],
      [{ text: "🤟 Join the Community", url: "https://t.me/kokomo_games" }],
    ],
  };

  await ctx.reply(message, {
    parse_mode: "HTML",
    reply_markup: replyMarkup,
  });
}

async function sendOgNftHelp(ctx, tokenId, contractAddress) {
  const message = `<b><i>If you entered a MetaMask address:</i></b>
1️⃣ Open your wallet and change network to 'Avalanche Network C-Chain'
2️⃣ Go to your NFTs, and look for 'Import NFT' or similar
3️⃣ Enter the details below:
<b>Contract Address:</b> ${contractAddress}
<b>Token ID:</b> ${tokenId}

*<i>*Sometimes Avalanche NFTs don't show in MetaMask mobile. This is a MetaMask issue - check on MetaMask browser or OpenSea to see your Kokomo NFT!</i>*

<b><i>If you entered a Rabby Wallet address:</i></b>
1️⃣ Open your wallet and go to the activity tab: 🕒
2️⃣ Look for the correct mint transaction: 📜 mint ${contractAddress.slice(
    0,
    5
  )}…${contractAddress.slice(-4)}
3️⃣ Click the green text to the right of the small NFT icon: + 1 #x

<b><i>If you want to view your NFT in OpenSea:</i></b>
1️⃣ Go to opensea.io and log-in by connecting the wallet you used to mint
2️⃣ Go to your OpenSea profile
3️⃣ If you can't see your Kokomo NFT, press More and click Hidden. Then move it out of there!

If you still need further support, join us in our Early Kokomons chat: @early_kokomons`;

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "🎮 Play 1M1",
          url: "https://t.me/One_Million_One_bot/game_on",
        },
      ],
      [{ text: "🤟 Join the Community", url: "https://t.me/kokomo_games" }],
    ],
  };

  await ctx.reply(message, {
    parse_mode: "HTML",
    reply_markup: replyMarkup,
  });
}

/**
 * Fetch specific NFTs based on provided criteria.
 * @param {string} walletAddress - The wallet address to fetch NFTs for.
 * @param {Object} criteria - The criteria to filter NFTs.
 * @returns {Promise<Array>} - Returns a promise with an array of NFT details.
 */
async function findSpecificNfts(walletAddress, criteria) {
  const url = `${GLACIER_API_URL}/${walletAddress}/balances:listErc721`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "x-glacier-api-key":
          "ac_9IcrCll7cf777AKIkvO_dsXOvtRRVcKvtNPw4_D9UlWwJimu93V0homFCkZrY_SYjj2qmFFZib8K7WHIJapsJQ",
      },
    });

    const data = response.data;
    // console.log("API Response:", data); // Debugging log

    if (data.erc721TokenBalances) {
      return data.erc721TokenBalances;
    } else {
      console.log("No ERC-721 token balances found for this wallet.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching NFTs:", error.message);
    throw error;
  }
}

bot.action(/view_nft_(.+)/, async (ctx) => {
  const tokenId = ctx.match[1];
  // Fetch and display detailed information about the NFT with the given tokenId
  await ctx.reply(`Fetching details for NFT with Token ID: ${tokenId}`);
  // Implement the logic to fetch and display the NFT details here
  ctx.answerCbQuery(); // Acknowledge the callback query
});

bot.start(async (ctx) => {
  try {
    const username = ctx?.from?.username || ctx?.from?.first_name || "Player";
    const [type, code] = ctx?.message?.text?.split?.("_") || [];
    const userId = ctx?.from?.id;
    const [, typeKey] = `${type || ""}`.split(" ");
    const friend_app = `${HOST_URL}/1v1/waiting?inviteKey=${code}`;
    const { sessionId: inviter } = code ? decodeInviteKey(code) : {};

    console.log("refCode", code);
    console.log("Username", username);

    let userData = null;

    // Get user data
    try {
      const res = await axios.get(`${USER_CREATION_ENDPOINT}/${userId}`);
      userData = res?.data?.data?.user;
      console.log("typeKey =>", typeKey);
      console.log("Start User Info => ", userData);
    } catch (error) {
      if ([400, 404]?.includes(error?.response?.status))
        console.log("New user:", userId);
      else console.error("Error fetching user:", error);
    }

    // Send message to inviter
    if (typeKey == "GI" && inviter) {
      await ctx.replyWithHTML(
        `💥 <b>Your 1v1 is ready!</b>

Enter the waiting room to claim your Kokos and compete for the prize.

May the best tapper win!`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🎮 Play With Friend Now",
                  web_app: { url: friend_app },
                },
              ],
            ],
          },
        }
      );
    } else {
      ctx.replyWithHTML(
        `<b>Welcome to the official launch of One Million and One Kokos!</b>

Hit <b>Play Now</b> to start earning Kokomo Points - Kokos 🥥

🕹️ <b>Farm Kokos</b> on the main board, challenge other players in <b>real-time 1v1 battles</b>, or try the <b>Koko Spinner</b> for rewards! 🎡

<b>Why do Points matter:</b>
🥥 Points carry over across the whole Kokomo ecosystem.
👀 More Kokos = better Rewards… including Airdrop!
💎 Claim free Kokomo NFTs inside the game to unlock future perks and rewards! 🤑

<i>P.S. Inviting friends won't go unnoticed. We don't forget to reward our most loyal Kokomons 😉</i>`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🎮 Play Now",
                  url: `${HOST_URL}`,
                },
              ],
              [
                {
                  text: "🥥 Join the Community",
                  url: "https://t.me/kokomo_games",
                },
              ],
              [{ text: "🌴 Game Guide", callback_data: "game_guide" }],
            ],
          },
        }
      );
    }

    // Create or update user
    try {
      if (!userData?.id) {
        await axios.post(USER_CREATION_ENDPOINT, {
          sessionId: ctx.from.id,
          username: ctx.from.username || "",
          referrerSessionId: code || "",
        });
      } else {
        axios.patch(`${USER_CREATION_ENDPOINT}/${ctx.from.id}`, {
          username: ctx.from.username || "",
        });
      }
    } catch (error) {
      console.error("Error creating/updating user:", error?.message);
    }

    // Handle referrals
    if (code) {
      referrals[ctx.from.id] = code;
      console.log(`User ${ctx.from.id} referred by ${code}`);
    }
  } catch (error) {
    console.log(error);
  }
});

// bot.command("nft_help", async (ctx) => {
//   await ctx.reply("Please enter your wallet address:");
//   bot.on("text", async (ctx) => {
//     const walletAddress = ctx.message.text.trim();
//     await sendNftHelp(ctx, walletAddress);
//   });
// });

bot.on("callback_query", async (ctx) => {
  try {
    const callbackData = ctx.callbackQuery.data;
    console.log("Callback Data:", callbackData); // Log callback data for debugging

    const [action, actionType, type] = callbackData.split("_");

    if (
      action === "get" &&
      actionType === "nft-help" &&
      ["welcome", "OG"].includes(type)
    ) {
      await sendNftHelp(ctx, type);
    } else {
      await ctx.reply("Invalid action or type. Please try again.");
    }

    ctx.answerCbQuery();
  } catch (error) {
    console.error("Error handling callback query:", error);
    await ctx.reply("An error occurred while processing your request.");
  }
});

app.get("/", (req, res) => {
  res.send("Telegram bot is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("Bot is running" + emojis.rocket);
  bot.launch();
});
