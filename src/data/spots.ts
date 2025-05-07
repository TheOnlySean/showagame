export interface Spot {
  id: number;
  leftPct: number; // 0~1
  topPct: number;  // 0~1
  widthPct: number; // 0~1
  heightPct: number; // 0~1
  desc: string;
}

export const spots: Spot[] = [
  { id: 1, leftPct: 0.16, topPct: 0.60, widthPct: 0.12, heightPct: 0.12, desc: "自転車のチェーンがない" },
  { id: 2, leftPct: 0.75, topPct: 0.90, widthPct: 0.10, heightPct: 0.10, desc: "自動販売機に現代の飲み物" },
  { id: 3, leftPct: 0.45, topPct: 0.40, widthPct: 0.08, heightPct: 0.08, desc: "看板の文字が間違っている" },
  { id: 4, leftPct: 0.62, topPct: 0.20, widthPct: 0.12, heightPct: 0.12, desc: "山の上に建物がある" },
  { id: 5, leftPct: 0.25, topPct: 0.80, widthPct: 0.10, heightPct: 0.10, desc: "和服の子供がスニーカーを履いている" },
  { id: 6, leftPct: 0.10, topPct: 0.15, widthPct: 0.09, heightPct: 0.09, desc: "旗の色が違う" },
  { id: 7, leftPct: 0.55, topPct: 0.75, widthPct: 0.10, heightPct: 0.10, desc: "犬がいない" },
  { id: 8, leftPct: 0.32, topPct: 0.25, widthPct: 0.08, heightPct: 0.08, desc: "窓の形が違う" },
  { id: 9, leftPct: 0.80, topPct: 0.35, widthPct: 0.09, heightPct: 0.09, desc: "帽子の色が違う" },
  { id: 10, leftPct: 0.60, topPct: 0.55, widthPct: 0.10, heightPct: 0.10, desc: "自転車のカゴがない" },
  // ...可以根據實際需求再添加
]; 