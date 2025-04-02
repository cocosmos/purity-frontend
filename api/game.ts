import axiosInstance from "@/api/index";
import {Player} from "@/types/Player";

export const getGames = async ()=> {
    return await axiosInstance.get("/games");
}