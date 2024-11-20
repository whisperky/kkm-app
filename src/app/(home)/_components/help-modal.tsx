import { cn } from "@/lib/utils";
import { BoxContent, BoxMain } from "@/src/_components/shared/board-structure";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/src/_components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/src/_components/ui/dialog";
import { AccordionItem } from "@radix-ui/react-accordion";
import React from "react";

export default function HelpModal({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent containerClassName="h-full flex flex-col !overflow-hidden !max-h-[70dvh]" title="Help">
        <BoxMain className="rounded-t-3xl flex-1">
          <BoxContent className="p-3 mx-2 mb-2 grid rounded-xl border border-solid border-white/40 bg-gradient-to-b from-[#C4A797] to-[#DDC2A7]">
            <Accordion type="single" collapsible>
              {[
                {
                  id: 1,
                  title: "What is 1M1?",
                  content:
                    "1M1 is PvP tapping. Whatever you do on your board, also happens on everyone else's board. There are one million and one empty boxes on the board. When they are all filled, the board will be frozen until the next game reset. ",
                },
                {
                  id: 2,
                  title: "How do you play 1M1?",
                  content:
                    "Check empty boxes to fill them with Kokos and earn points. Your Kokos are green, red Kokos belong to other players. Everyone plays on the same board, which means you can also uncheck other players, making them lose -1 point. This is a Sabotage.",
                },
                {
                  id: 3,
                  title: "What is the goal of 1M1?",
                  content:
                    "Your goal is to earn as many Kokos as possible before the board completes, avoiding Sabotage (or Sabotaging intentionally!) along the way",
                },
                {
                  id: 4,
                  title: "Why do I want Kokos?",
                  content:
                    "Kokos are the points of the Kokomo ecosystem. Kokos can be used to play games for free, enter cash competitions, or can be converted into various rewards including token airdrops.",
                },
                {
                  id: 5,
                  title: "How do I earn more Kokos?",
                  content:
                    "After checking a number of boxes in a row or sabotaging a number of boxes in a row, you unlock Streaks! Streaks give you bonus points. You can also play 1v1 Mini-Matches or try your luck at Koko Spin.",
                },
                {
                  id: 6,
                  title: "Why would I Sabotage?",
                  content:
                    "Simple: Sabotage Streaks earn you more points than regular checking Streaks. Also, PvP is fun. Right?",
                },
                {
                  id: 7,
                  title: "What is Point Protection?",
                  content:
                    "Point Protection is a special boost that you can claim daily. Once activated, the next Kokos you check will forever be protected from other players sabotaging your boxes! This is the best way to secure your Koko points.",
                },
                {
                  id: 8,
                  title: "What is the OG NFT?",
                  content:
                    "The Kokomo OG is a free NFT that can be minted after completing a few easy tasks. Holding an OG unlocks lots of perks in the upcoming Kokomo ecosystem, like bonus points, point multipliers, priority whitelist access, discounts, and more!",
                },
                {
                  id: 9,
                  title: "What is a Golden Kokonut?",
                  content:
                    "Hidden across the map are a few Golden Kokonuts. If you find one, you'll get a really, really, really nice reward. Go get looking!",
                },
                {
                  id: 10,
                  title: "How do I participate in Koko Spin?",
                  content:
                    "You can participate in Koko Spin by claiming your free daily spin, inviting friends, or converting points! Make sure to play every day for a chance at winning big!",
                },
              ]?.map((one, index) => (
                <AccordionItem
                  value={`item-${one?.id}`}
                  key={one?.id}
                  className={cn(
                    "bg-[#E3BEAA] border border-solid border-white/45 shadow-[0_.7rem_0_-.45rem] shadow-black/10 rounded-lg text-golden-brown",
                    index != 0 && "mt-3"
                  )}
                >
                  <AccordionTrigger className="text-start p-3 gap-3 !no-underline font-bold">
                    <span>
                      {index + 1}. {one?.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="p-3 pt-0 font-medium">
                    <hr className="border-0 border-t border-solid border-black/50 mb-3" />
                    {one?.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </BoxContent>
        </BoxMain>
      </DialogContent>
    </Dialog>
  );
}
