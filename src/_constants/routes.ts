import { Gem, LucideIcon, Medal, Play, User, Zap } from "lucide-react";

type TRoute = {
  path: string;
  title: string;
  icon: LucideIcon;
};

const routes: TRoute[] = [
  {
    icon: User,
    title: "Profile",
    path: "/profile",
  },
  {
    icon: Medal,
    title: "Stats",
    path: "/ranking",
  },
  {
    icon: Play,
    path: "/",
    title: "Play",
  },
  {
    icon: Zap,
    path: "/boosts",
    title: "Boosts",
  },
  {
    icon: Gem,
    title: "Social",
    path: "/bonus",
  },
];

export { routes };
