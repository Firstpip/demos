import { Music, Drama, Camera, Tent, Wand2, Mic, Palette, Sparkles } from "lucide-react";
import { Category } from "../types";

export const categories: Category[] = [
  { id: "dance", name: "댄스", slug: "dance", icon: Sparkles },
  { id: "music", name: "음악", slug: "music", icon: Music },
  { id: "acting", name: "연기", slug: "acting", icon: Drama },
  { id: "model", name: "모델", slug: "model", icon: Camera },
  { id: "circus", name: "서커스", slug: "circus", icon: Tent },
  { id: "magic", name: "마술", slug: "magic", icon: Wand2 },
  { id: "voice", name: "성우", slug: "voice", icon: Mic },
  { id: "etc", name: "기타", slug: "etc", icon: Palette },
];

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}
