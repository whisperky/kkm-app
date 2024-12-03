import { useMutation, useQuery } from "@tanstack/react-query";
import { baseInstance } from "../axios";

export function useStoreItems(sessionId: TSessionId) {
  return useQuery({
    queryKey: ["store-items", sessionId],
    queryFn: () =>
      baseInstance
        .get<{ data: IStoreItemsRes }>(`/nft-service/store/items`, {
          params: { sessionId },
        })
        .then((res) => res.data),
  });
}

export interface IStoreItemsRes {
  data: IStoreItem[];
  total: number;
  size: number;
  start: number;
  end: number;
}

export interface IStoreItem {
  id: string;
  name: string;
  description: string;
  price: string;
  details: {
    multiplier: number | string;
    days_unlockable: number;
    icon?: string;
    star?: boolean;
    isPopular?: boolean;
    rewards?: {
      kokos: number;
      spins: number;
      collectibles: number;
    };
  };
  type_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  type: IStoreItemType;
  user_items: IUserItem[];
}

export interface IStoreItemType {
  id: string;
  name: string;
  key: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUserItem {
  id: string;
  sessionId: string;
  item_id: string;
  price: string;
  activated: boolean;
  purchase_details: {
    purchased_at: Date;
    payment_method: string;
    current_day?: number;
    last_update?: Date;
  };
  created_at: Date;
  updated_at: Date;
}

export function useBuyStore() {
  return useMutation({
    mutationKey: ["store-items"],
    mutationFn: ({
      title,
      description,
      price,
      item_id,
    }: {
      title: string;
      description: string;
      price: number;
      item_id: string;
    }) =>
      baseInstance
        .post<{ data: string }>(`/bot-service/transactions/generate-invoice`, {
          title,
          description,
          price,
          item_id,
        })
        .then((res) => res.data),
  });
}

export function useEditUserItem() {
  return useMutation({
    mutationKey: ["edit-user-item"],
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: {
        sessionId?: string;
        item_id?: string;
        price?: number;
        activated?: false;
        purchase_details?: {
          purchased_at?: string;
          payment_method?: string;
          current_day?: number;
          last_update?: Date;
        };
      };
    }) =>
      baseInstance
        .patch<{ message: string }>(`/nft-service/store/user-items/${id}`, body)
        .then((res) => res.data),
  });
}
