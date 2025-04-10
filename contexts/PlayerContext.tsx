import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { createPlayer, getPlayer } from "@/api/player";
import { Player } from "@/types/Player";
import { useFormErrors } from "./FormErrorContext";

interface PlayerContextType {
  player: Player | null;
  setPlayer: (player: Player | null) => void;
  createNewPlayer: (username: string) => Promise<Player | null>;
  clearPlayer: () => Promise<void>;
  loading: boolean;
}

const PlayerContext = createContext<PlayerContextType>({
  player: null,
  setPlayer: () => {},
  createNewPlayer: async () => null,
  loading: true,
  clearPlayer: async () => {},
});

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearFieldErrors } = useFormErrors();

  // Helper to handle localStorage in web and SecureStore in native
  const storeData = async (key: string, value: string) => {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const getData = async (key: string) => {
    try {
      if (Platform.OS === "web") {
        return localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      return null;
    }
  };

  // Load player from storage on mount
  useEffect(() => {
    const loadPlayer = async () => {
      const storedPlayer = await getData("player");
      if (storedPlayer) {
        setPlayer(JSON.parse(storedPlayer));
      }
      setLoading(false);
    };

    const getPlayerFromApi = async (player_id: string) => {
      try {
        const { data } = await getPlayer(player_id); // Replace with actual API call to get player
        setPlayer(data.player);
      } catch (error) {
        console.error("Error fetching player data:", error);
        clearPlayer();
      }
    };

    loadPlayer();

    if (player) {
      getPlayerFromApi(player.id); // Fetch player data from API if player exists
    }
  }, []);

  // Save player to storage when it changes
  useEffect(() => {
    if (player) {
      storeData("player", JSON.stringify(player));
    }
  }, [player]);

  const createNewPlayer = async (username: string): Promise<Player> => {
    try {
      const { data } = await createPlayer(username);
      setPlayer(data.player);
      return data.player;
    } catch (error) {
      console.error("Error creating player:", error);
      throw error;
    }
  };

  const clearPlayer = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("player");
      } else {
        await SecureStore.deleteItemAsync("player");
      }
      setPlayer(null);
      clearFieldErrors();
    } catch (error) {
      console.error("Error clearing player data:", error);
    }
  };

  return (
    <PlayerContext.Provider
      value={{ player, setPlayer, createNewPlayer, loading, clearPlayer }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
