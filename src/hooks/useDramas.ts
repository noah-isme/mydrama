import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "../utils/api";
import { Drama, StreamData } from "../types";

export const dramaKeys = {
  all: ["dramas"] as const,
  latest: () => [...dramaKeys.all, "latest"] as const,
  search: (query: string) => [...dramaKeys.all, "search", query] as const,
  mood: (mood: string) => [...dramaKeys.all, "mood", mood] as const,
  stream: (bookId: string, episode: number) =>
    [...dramaKeys.all, "stream", bookId, episode] as const,
};

export const useLatestDramas = () => {
  return useQuery({
    queryKey: dramaKeys.latest(),
    queryFn: async () => {
      const response = await fetchAPI<Drama[]>("/latest");
      if (!response.status || !response.data) {
        throw new Error(response.message || "Failed to fetch latest dramas");
      }
      return response.data;
    },
  });
};

export const useSearchDramas = (query: string) => {
  return useQuery({
    queryKey: dramaKeys.search(query),
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await fetchAPI<Drama[]>("/search", { query });
      if (!response.status || !response.data) {
        throw new Error(response.message || "Failed to search dramas");
      }
      return response.data;
    },
    enabled: !!query.trim(),
  });
};

export const useMoodDramas = (mood: string | null) => {
  return useQuery({
    queryKey: dramaKeys.mood(mood || ""),
    queryFn: async () => {
      if (!mood) return [];
      const response = await fetchAPI<Drama[]>(`/mood/${mood}`);
      if (!response.status || !response.data) {
        throw new Error(response.message || "Failed to fetch mood dramas");
      }
      return response.data;
    },
    enabled: !!mood,
  });
};

export const useDramaStream = (bookId: string, episode: number) => {
  return useQuery({
    queryKey: dramaKeys.stream(bookId, episode),
    queryFn: async () => {
      if (!bookId) return null;
      const response = await fetchAPI<StreamData>("/stream", {
        bookId,
        episode,
      });
      if (!response.status && !response.data && !(response as any).url) {
         throw new Error(response.message || "Failed to fetch stream");
      }
      if (response.data && response.data.url) return response.data;
      if ((response as any).url) return { url: (response as any).url } as StreamData;
      
      return response.data;
    },
    enabled: !!bookId,
    staleTime: 30 * 60 * 1000,
  });
};
