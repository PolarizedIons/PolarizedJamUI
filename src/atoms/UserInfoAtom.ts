import Konva from "konva";
import { atom } from "recoil";

type UserInfoType = {
    name: string;
    color: string;
}

export const UserInfoAtom = atom<UserInfoType>({
    key: 'UserInfo',
    default: {name: 'Anonymous', color: Konva.Util.getRandomColor()},
});
