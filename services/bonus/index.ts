/** @format */

import { useMutation, useQuery } from "@tanstack/react-query";
import { baseInstance } from "../axios";
import { objectToQueryParams } from "@/utils/query-params";

export function useCheckCoconutInTwitterUsername({
  userId,
  enabled,
}: {
  userId: string;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["check-twitter-username-saved", userId],
    queryFn: () =>
      baseInstance
        .get(`/users/check-kokonut-in-twitter-username?sessionId=${userId}`)
        .then((res) => res.data),
    enabled: enabled,
    staleTime: 0,
  });
}

export function useCheckHasTwitterUsername({
  userId,
  enabled,
}: {
  userId: string;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["check-twitter-username", userId],
    queryFn: () =>
      baseInstance
        .get(`/users/has-twitter-username?sessionId=${userId}`)
        .then((res) => res.data),
    enabled: enabled,
  });
}

export function useGetTwitterAuthUrl({
  userId,
  enabled,
}: {
  userId: string;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["twitter-auth-url"],
    queryFn: () =>
      baseInstance
        .get(`/users/auth/twitter-login?sessionId=${userId}`)
        .then((res) => res.data),
    enabled: enabled,
  });
}

export interface ICheckCommunity {
  inChannel: boolean;
  message?: string;
  error?: string;
}

export function useCheckUserInTelegramChannel({
  tgUserId,
  enabled,
}: {
  tgUserId: TSessionId;
  enabled: boolean;
}) {
  const queryParams = objectToQueryParams({ tgUserId: tgUserId });

  return useQuery({
    queryKey: ["check-user-in-telegram-channel", tgUserId],
    queryFn: () =>
      baseInstance
        .get<ICheckCommunity>(
          `/bonus-service/bonus/telegram/check-is-user-in-community?${queryParams}`,
        )
        .then((res) => res.data),
    enabled: enabled,
    staleTime: 0,
  });
}

export interface ICheckTweet {
  message?: string;
  error?: string;
}

export function useCheckTweet({
  tgUserId,
  twitterId,
  enabled,
}: {
  tgUserId: TSessionId;
  twitterId: string;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["check-tweet", tgUserId],
    queryFn: () =>
      baseInstance
        .get<ICheckTweet>(`/bonus-service/bonus/twitter/check-tweets`, {
          params: { sessionId: tgUserId, twitterId },
        })
        .then((res) => res.data),
    enabled: enabled,
    staleTime: 0,
  });
}

interface ICheckUserBonus {
  data: {
    sessionId: string;
    bonusId: string;
    status: "pending" | "claimed";
    userBonusId: string;
    created_at: string;
    updated_at: string;
  };
  message: string;
}

export function useCheckUserBonus({
  userId,
  bonusName,
}: {
  userId: TSessionId;
  bonusName: string;
}) {
  const queryParams = objectToQueryParams({
    userId: userId,
    bonusName: bonusName,
  });

  return useQuery({
    queryKey: ["check-user-bonus", userId, bonusName],
    queryFn: () =>
      baseInstance
        .get<ICheckUserBonus>(`/bonus-service/bonus/check?${queryParams}`)
        .then((res) => res.data),
  });
}

export function useCheckUserEmailExist({ userId }: { userId: number }) {
  return useQuery({
    queryKey: ["add_email", userId],
    queryFn: () =>
      baseInstance
        .get(`/users/check-email?sessionId=${userId}`)
        .then((res) => res.data),
  });
}

export function useGetTotalBonusPrize() {
  return useQuery({
    queryKey: ["total-bonus-prize"],
    queryFn: () =>
      baseInstance
        .get(`/bonus-service/bonus/total-prize-of-all-bonuses`)
        .then((res) => res.data),
  });
}

export function useGetTotalPrizeOfUserClaimedBonus({
  tgUserId,
}: {
  tgUserId: number | string;
}) {
  return useQuery({
    queryKey: ["total-prize-of-user-claimed-bonus", tgUserId],
    queryFn: () =>
      baseInstance
        .get(
          `/points-service/bonus/user-total-prize-of-claimed-bonuses?sessionId=${tgUserId}`,
        )
        .then((res) => res.data),
  });
}

export interface IBonuses {
  bonusId: string;
  bonusName: string;
  description: string;
  prize: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  UserBonus: IUserBonus[];
}

export interface IUserBonus {
  userBonusId: string;
  tgUserId: string;
  bonusId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useGetUserBonuses({ userId }: { userId: TSessionId }) {
  return useQuery({
    queryKey: ["user_bonuses"],
    queryFn: () =>
      baseInstance
        .get<{ data: IBonuses[] }>(`/bonus-service/bonus/user/${userId}`)
        .then((res) => res.data),
  });
}

export interface IBonusCompletion {
  completionPercentage: string;
  totalBonuses: number;
  completedBonuses: number;
  bonuses: {
    bonusName: string;
    status: "active" | "dormant";
    userBonuses: {
      userBonusId: string;
      sessionId: string;
      bonusId: string;
      status: string;
      created_at: Date;
      updated_at: Date;
    }[];
  }[];
}

export function useBonusCompletion({ sessionId }: { sessionId: TSessionId }) {
  return useQuery({
    queryKey: ["user-bonus-completion", sessionId],
    queryFn: () =>
      baseInstance
        .get<{
          data: IBonusCompletion;
        }>(`/bonus-service/bonus/completion-stats?sessionId=${sessionId}`)
        .then((res) => res.data),
  });
}

export function useTwitterLogin() {
  return useMutation({
    mutationKey: ["twitter-login"],
    mutationFn: ({
      sessionId,
      twitterUsername,
    }: {
      sessionId: TSessionId;
      twitterUsername: string;
    }) =>
      baseInstance
        .post<{ data: any }>(`/user-service/twitter/login`, {
          sessionId,
          twitterUsername,
        })
        .then((res) => res.data),
  });
}

export function useFreezingKokos() {
  return useMutation({
    mutationKey: ["freeze-kokos"],
    mutationFn: () =>
      baseInstance
        .get<{ data: any }>('/points-service/koko/freeze/getAll')
        .then((res) => res.data),
  });
}

export function useTwitterLogin2() {
  return useMutation({
    mutationKey: ["twitter-login"],
    mutationFn: ({
      sessionId,
      twitterUsername,
      bonusName,
    }: {
      sessionId: TSessionId;
      twitterUsername: string;
      bonusName: string
    }) =>
      baseInstance
        .post<{ data: any }>(`/user-service/twitter/login-v2`, {
          sessionId,
          twitterUsername,
          bonusName,
        })
        .then((res) => res.data),
  });
}

interface ICheckUserBonus2 {
  data: {
    sessionId: string;
    bonusId: string;
    status: "pending" | "claimed";
    userBonusId: string;
    created_at: string;
    updated_at: string;
    bonus: {
      bonusId: string;
      bonusName: string;
      description: string;
      prize: number;
      status: string;
      created_at: string;
      updated_at: string;
    };
  };
  message: string;
}

export function useCheckUserBonus2({
  userId,
  bonusName,
}: {
  userId: TSessionId;
  bonusName: string;
}) {
  return useQuery({
    queryKey: ["check-2-user-bonus", userId, bonusName],
    queryFn: ({ signal }) =>
      baseInstance
        .get<ICheckUserBonus2>(`/bonus-service/bonus/check-bonus`, {
          params: { userId, bonusName },
          signal,
        })
        .then((res) => res.data),
  });
}
export interface BonusContent {
  bonusId:     string;
  bonusName:   string;
  description: string;
  prize:       number;
  status:      Status;
  type:        null | string;
  details:     Details;
  created_at:  Date;
  updated_at:  Date;
  claimed?: boolean;
}

export interface Details {
  link?:     string;
  toast?:    Toast;
  platform?: string;
  tweet?:    null;
  toasts?:   Toast;
}

export interface Toast {
  error:        null | string;
  loading:      null | string;
  success:      null | string;
  notVerified?: null;
}

export enum Status {
  // eslint-disable-next-line no-unused-vars
  Dormant = "dormant",
  // eslint-disable-next-line no-unused-vars
  Expired = "expired",
}
