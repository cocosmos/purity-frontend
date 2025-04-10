import axiosInstance from "@/api/index";
import { Player } from "@/types/Player";

export const getPlayer = async (
  player_id: string
): Promise<{ data: Player }> => {
  return await axiosInstance.get(`/players/${player_id}`);
};

export const createPlayer = async (username: string) => {
  return await axiosInstance.post("/players", {
    username,
  });
};
