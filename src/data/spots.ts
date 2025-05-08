// 圖片尺寸為 1024x1024，左上角為原點(0,0)，右下角為(1024,1024)
const IMG_WIDTH = 1024;
const IMG_HEIGHT = 1024;
const HOTSPOT_SIZE = 0.10; // 熱區大小為圖片的10%

// 計算熱區左上角坐標（使給定坐標成為中心點）
function calculateHotspotPosition(centerX: number, centerY: number) {
  return {
    leftPct: (centerX - (IMG_WIDTH * HOTSPOT_SIZE / 2)) / IMG_WIDTH,
    topPct: (centerY - (IMG_HEIGHT * HOTSPOT_SIZE / 2)) / IMG_HEIGHT
  };
}

export interface Spot {
  id: number;
  leftPct: number; // 0~1
  topPct: number;  // 0~1
  widthPct: number; // 0~1
  heightPct: number; // 0~1
  desc: string;
}

export const spots: Spot[] = [
  {
    id: 1,
    ...calculateHotspotPosition(880, 794),
    widthPct: HOTSPOT_SIZE,
    heightPct: HOTSPOT_SIZE,
    desc: "牛車の車輪が壊れている：昭和時代の牛車の車輪が一部欠けている"
  },
  {
    id: 2,
    ...calculateHotspotPosition(794, 445),
    widthPct: HOTSPOT_SIZE,
    heightPct: HOTSPOT_SIZE,
    desc: "牛の角が折れている：引っ張っている牛の角が途中で折れている"
  },
  {
    id: 3,
    ...calculateHotspotPosition(888, 637),
    widthPct: HOTSPOT_SIZE,
    heightPct: HOTSPOT_SIZE,
    desc: "木の枝が折れている：路傍の木の枝が途中で折れている"
  },
  {
    id: 4,
    ...calculateHotspotPosition(696, 886),
    widthPct: HOTSPOT_SIZE,
    heightPct: HOTSPOT_SIZE,
    desc: "地面に穴が開いている：土の地面に小さな穴が開いている"
  },
  {
    id: 5,
    ...calculateHotspotPosition(457, 565),
    widthPct: HOTSPOT_SIZE,
    heightPct: HOTSPOT_SIZE,
    desc: "屋根の瓦が壊れている：古い家の屋根の瓦が一部壊れている"
  },
  {
    id: 6,
    ...calculateHotspotPosition(433, 387),
    widthPct: HOTSPOT_SIZE,
    heightPct: HOTSPOT_SIZE,
    desc: "窓ガラスが割れている：家の窓ガラスが一部割れている"
  },
  {
    id: 7,
    ...calculateHotspotPosition(420, 969),
    widthPct: HOTSPOT_SIZE,
    heightPct: HOTSPOT_SIZE,
    desc: "地面に落ちている物：地面に何か物が落ちている"
  },
  {
    id: 8,
    ...calculateHotspotPosition(278, 769),
    widthPct: HOTSPOT_SIZE,
    heightPct: HOTSPOT_SIZE,
    desc: "木の幹に傷がある：大きな木の幹に傷がついている"
  },
  {
    id: 9,
    ...calculateHotspotPosition(189, 373),
    widthPct: HOTSPOT_SIZE,
    heightPct: HOTSPOT_SIZE,
    desc: "鳥の巣が壊れている：木の上の鳥の巣が壊れている"
  },
  {
    id: 10,
    ...calculateHotspotPosition(512, 258),
    widthPct: HOTSPOT_SIZE,
    heightPct: HOTSPOT_SIZE,
    desc: "雲の形が違う：空の雲の形が不自然に変わっている"
  }
]; 