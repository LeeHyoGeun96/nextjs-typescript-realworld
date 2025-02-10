import { API_ENDPOINTS } from "@/constant/api";
import { getCurrentUserClient } from "@/utils/supabase/getCurrentUserClient";

export const fetcher = async (url: string) => {
  try {
    switch (url) {
      case API_ENDPOINTS.CURRENT_USER:
        return getCurrentUserClient();
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
