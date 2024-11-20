import { StaticImageData } from "next/image";
import ShareTweetTask from "../_components/share-tweet";

import kokomoIcon from "@/_assets/icons/kokomo-1.png";
import kokomoIcon2 from "@/_assets/icons/kokomo-2.png";
import kokomoIcon3 from "@/_assets/icons/kokomo-3.png";
import kokomoIcon4 from "@/_assets/icons/kokomo-4.png";
import kokomoIcon5 from "@/_assets/icons/kokomo-5.png";
import kokomoIcon6 from "@/_assets/icons/kokomo-6.png";
import spinnerIcon from "@/_assets/icons/spinner.png";
import kokomonIcon from "@/_assets/icons/kokomon.png";
import kokonutIcon from "@/_assets/icons/kokonut.png";

interface Task {
  title: string;
  titleKey: string;
  bonusPrize: number;
  bonusType: "follow" | "invite" | "join" | "partner" | "share";
  platform: "telegram" | "x" | "external";
  lit?: boolean;
  actionLink?: string;
  specialComponent?: typeof ShareTweetTask;
}

interface CollectorItem {
  id: number;
  title: string;
  price: number;
  purchased?: boolean;
  claimed?: boolean;
  icon: StaticImageData;
}

interface CatchUpItem {
  id: number;
  title: string;
  collectibles: number;
  kokos: number;
  spins: number;
  price: number;
  purchased?: boolean;
  claimed?: boolean;
  icon: StaticImageData;
  isPopular?: boolean;
}

const OUR_X_LINK = "https://x.com/kokomo_games";
const OUR_TG_COMMUNITY_LINK =
  process.env.NEXT_PUBLIC_COMMUNITY_URL ?? "https://t.me/kokomo_games";

const kokoTasks: Task[] = [
  {
    title: "Follow us on X",
    titleKey: "follow_twitter",
    bonusPrize: 1000,
    bonusType: "follow",
    platform: "x",
    actionLink: OUR_X_LINK,
  },
  {
    title: "Join Our Telegram Community",
    titleKey: "telegram_community",
    bonusPrize: 1000,
    bonusType: "join",
    platform: "telegram",
    actionLink: OUR_TG_COMMUNITY_LINK,
  },
  // {
  //   title: "Invite a Friend",
  //   titleKey: "invite_3_friends",
  //   bonusPrize: 5000,
  //   bonusType: "invite",
  //   platform: "telegram",
  // },
  // {
  //   title: "Join Our Telegram Chat",
  //   titleKey: "join_our_telegram_chat",
  //   bonusPrize: 5000,
  //   bonusType: "join",
  //   platform: "telegram",
  //   lit: true,
  //   actionLink: "https://t.me/early_kokomons",
  // },
  // {
  //   title: "Share this Tweet",
  //   titleKey: "share_tweet_team_ex_cod_lol",
  //   bonusPrize: 10000,
  //   bonusType: "share",
  //   platform: "x",
  //   actionLink:
  //     "https://x.com/intent/post?text=Secured%20my%20free%20%40kokomo_games%20OG%20NFT%21%F0%9F%A5%A5%20Did%20you%3F%F0%9F%A5%A5%20%0A%0AComplete%203%20tasks%20in%20their%20TG%20game%20to%20get%20yours%3A%20http%3A%2F%2Ft.me%2FOne_Million_One_bot%3Fstart%3Drs_bt",
  //   specialComponent: ShareTweetTask,
  // },
];
const partnerTasks: Task[] = [
  // {
  //   title: "Join Moondrops Game",
  //   titleKey: "join_moondrops_game",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink: "https://rebrand.ly/kokomogame",
  // },
  // {
  //   title: "Subscribe Moondrops TG",
  //   titleKey: "subscribe_moondrops_tg",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink: "https://t.me/MoonDropsAnnouncements",
  // },
  // {
  //   title: "Follow BlockGames on X",
  //   titleKey: "follow_blockgames_on_x",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink: "https://x.com/GetBlockGames",
  // },
  // {
  //   title: "Play Trikon Gaming",
  //   titleKey: "trikon_gaming",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink: "https://t.me/trikonbot/game?startapp=0ulweglq",
  // },
  // {
  //   title: "Join Trikon Channel",
  //   titleKey: "trikon_channel",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink: "https://t.me/trikonannouncement",
  // },
  // {
  //   title: "Join our Koko Friend 🏟️",
  //   titleKey: "follow_arena_games",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink: "https://kokol.ink/3MIuO6n",
  // },
  // {
  //   title: "Join our Koko Friend 🐝",
  //   titleKey: "follow_bee_verse",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink: "https://kokol.ink/3XGE7tv",
  // },
  // {
  //   title: "Follow Delegate on x",
  //   titleKey: "follow_delegate_on_x",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink: "https://x.com/delegate_web3",
  // },
  // {
  //   title: "Play Bomb Crypto 💣",
  //   titleKey: "play_bomb_crypto_bomb",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink: "https://t.me/bombcrypto_io_bot?startapp",
  // },
  // {
  //   title: "Join Bomb Crypto's TG",
  //   titleKey: "join_bomb_cryptos_tg",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink: "https://t.me/BombCryptoGroupp",
  // },
  // {
  //   title: "Enter the Digiverse",
  //   titleKey: "enter_digiverse",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink:
  //     "https://t.me/digibuy_bot/digiverse/start?startapp=0de0bce1bb6d566a4b65521a688950a1",
  // },
  // {
  //   title: "Play HangarX Games",
  //   titleKey: "play_hangarx_games",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink:
  //     "https://t.me/hangarxgaming_bot/hangarxgaming?startapp=bendirman",
  // },
  // {
  //   title: "Join HangarX Channel",
  //   titleKey: "join_hangarx_channel",
  //   bonusPrize: 5000,
  //   bonusType: "partner",
  //   platform: "external",
  //   lit: true,
  //   actionLink: "https://x.com/Hangarxio",
  // },
  {
    title: "Follow Zeeverse 🍀",
    titleKey: "follow_🍀",
    bonusPrize: 5000,
    bonusType: "partner",
    platform: "external",
    lit: true,
    actionLink: "https://x.com/ZeeverseGame",
  },
  {
    title: "Join Zeeverse 🍀",
    titleKey: "join_🍀",
    bonusPrize: 5000,
    bonusType: "partner",
    platform: "external",
    lit: true,
    actionLink: "https://t.me/zee_verse_bot",
  },
  {
    titleKey: "Channel_GrandJourney",
    title: "Join Grand Journey Channel",
    actionLink: "https://t.me/Channel_GrandJourney",
    bonusPrize: 5000,
    bonusType: "partner",
    platform: "external",
    lit: true,
  },
  {
    titleKey: "Channel_GrandJourney_app",
    title: "Join Grand Journey App",
    actionLink: "https://t.me/grandjourneybot/airdrop?startapp=ref_EGPO6s",
    bonusPrize: 5000,
    bonusType: "partner",
    platform: "external",
    lit: true,
  },
];

const collectorPassData: CollectorItem[] = [
  {
    id: 1,
    title: 'Kokomo Collectibles',
    price: 0.40,
    icon: kokomoIcon,
    claimed: true,
  },
  {
    id: 2,
    title: 'Kokomo Collectibles',
    price: 0.40,
    icon: kokomoIcon2,
  },
  {
    id: 3,
    title: "Kokomo Collectibles",
    price: 0.50,
    icon: kokomoIcon3,
  },
  {
    id: 4,
    title: 'Kokomo Collectibles',
    price: 0.70,
    purchased: true,
    icon: kokomoIcon4,
  },
  {
    id: 5,
    title: "Kokomo Collectibles",
    price: 0.80,
    icon: kokomoIcon5,
  },
  {
    id: 6,
    title: 'Kokomo Collectibles',
    price: 1,
    icon: kokomoIcon6,
  },
];

const catchUpBundlesData: CatchUpItem[] = [
  {
    id: 1,
    title: '5,000 Kokos 1 Spin',
    collectibles: 1,
    kokos: 5000,
    spins: 1,
    price: 0.25,
    icon: kokonutIcon,
  },
  {
    id: 2,
    title: '25,000 Kokos 5 Spins',
    collectibles: 2,
    kokos: 25000,
    spins: 5,
    price: 1,
    icon: spinnerIcon,
  },
  {
    id: 3,
    title: 'Kokomo Mega Bundle',
    icon: kokomonIcon,
    collectibles: 4,
    kokos: 100000,
    spins: 12,
    price: 3.50,
    isPopular: true,
  },
];

export { kokoTasks, partnerTasks, collectorPassData, catchUpBundlesData };
export type { Task, CollectorItem, CatchUpItem };
