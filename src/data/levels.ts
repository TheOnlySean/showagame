import type { Spot } from "./spots";

export interface LevelData {
  id: number;
  image: string;
  spots: Spot[];
  title: string;
}

import { spots as level1Spots } from "./spots";

// 复用spots.ts里的计算函数和常量
const IMG_WIDTH = 1024;
const IMG_HEIGHT = 1024;
const HOTSPOT_SIZE = 0.10;
function calculateHotspotPosition(centerX: number, centerY: number) {
  return {
    leftPct: (centerX - (IMG_WIDTH * HOTSPOT_SIZE / 2)) / IMG_WIDTH,
    topPct: (centerY - (IMG_HEIGHT * HOTSPOT_SIZE / 2)) / IMG_HEIGHT
  };
}

const level2Spots: Spot[] = [
  { id: 1, ...calculateHotspotPosition(184, 74), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "電車の左上隅に不自然なもの" },
  { id: 2, ...calculateHotspotPosition(104, 696), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "左下の老人の持ち物" },
  { id: 3, ...calculateHotspotPosition(468, 431), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "中央の女性の胸元" },
  { id: 4, ...calculateHotspotPosition(469, 582), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "中央の女性の腕時計" },
  { id: 5, ...calculateHotspotPosition(379, 810), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "左下の女性のバッグ" },
  { id: 6, ...calculateHotspotPosition(609, 490), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "右側の男性の腕" },
  { id: 7, ...calculateHotspotPosition(544, 955), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "右下隅の不自然なもの" },
  { id: 8, ...calculateHotspotPosition(607, 693), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "右下の女性の膝付近" },
  { id: 9, ...calculateHotspotPosition(834, 946), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "右下窓際の不自然なもの" },
  { id: 10, ...calculateHotspotPosition(946, 187), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "右上窓際の不自然なもの" },
];

const level3Spots: Spot[] = [
  { id: 1, ...calculateHotspotPosition(224, 744), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "商店街の看板の不自然な部分" },
  { id: 2, ...calculateHotspotPosition(373, 142), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "店舗の屋根の不自然な部分" },
  { id: 3, ...calculateHotspotPosition(379, 339), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "店舗の窓の不自然な部分" },
  { id: 4, ...calculateHotspotPosition(597, 611), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "道路の不自然な部分" },
  { id: 5, ...calculateHotspotPosition(603, 442), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "歩行者の不自然な部分" },
  { id: 6, ...calculateHotspotPosition(737, 552), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "店舗の看板の不自然な部分" },
  { id: 7, ...calculateHotspotPosition(974, 648), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "店舗の入口の不自然な部分" },
  { id: 8, ...calculateHotspotPosition(833, 477), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "店舗の商品の不自然な部分" },
  { id: 9, ...calculateHotspotPosition(931, 241), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "店舗の屋根の不自然な部分" },
  { id: 10, ...calculateHotspotPosition(946, 395), widthPct: HOTSPOT_SIZE, heightPct: HOTSPOT_SIZE, desc: "店舗の看板の不自然な部分" },
];

export const levels: LevelData[] = [
  {
    id: 1,
    image: "/images/level1.jpg",
    title: "昭和の町並み",
    spots: level1Spots
  },
  {
    id: 2,
    image: "/images/level2.jpg",
    title: "昭和のバス",
    spots: level2Spots
  },
  {
    id: 3,
    image: "/images/level3.jpg",
    title: "昭和の小学校",
    spots: level3Spots
  },
  {
    id: 4,
    image: "/images/level-locked.svg",
    title: "昭和の商店街",
    spots: level2Spots
  },
  {
    id: 5,
    image: "/images/level-locked.svg",
    title: "昭和の駅",
    spots: level1Spots
  },
  {
    id: 6,
    image: "/images/level-locked.svg",
    title: "昭和の居酒屋",
    spots: level2Spots
  },
  {
    id: 7,
    image: "/images/level-locked.svg",
    title: "昭和の公園",
    spots: level1Spots
  },
  {
    id: 8,
    image: "/images/level-locked.svg",
    title: "昭和の映画館",
    spots: level2Spots
  }
]; 