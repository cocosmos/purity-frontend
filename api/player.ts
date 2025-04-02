import axiosInstance from "@/api/index";
import {Player} from "@/types/Player";

export const createPlayer = async (username:string)=> {
    return await axiosInstance.post("/players", {
        username
    });
}