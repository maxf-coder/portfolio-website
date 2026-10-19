import type { IconType } from "react-icons";
import { LuBot, LuGlobe, LuServer } from "react-icons/lu";

export const SERVICES = [
  { id: "web", Icon: LuGlobe },
  { id: "backend", Icon: LuServer },
  { id: "automation", Icon: LuBot },
] as const satisfies readonly { id: string; Icon: IconType }[];

export type ServiceId = (typeof SERVICES)[number]["id"];