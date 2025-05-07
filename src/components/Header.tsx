import React from "react";

interface Props {
  foundCount: number;
  total: number;
}
export default function Header({ foundCount, total }: Props) {
  return (
    <header>
      <h1>まちがい探し 昭和の町</h1>
      <p>{total}個のまちがいを見つけてください</p>
      <p>見つけたまちがい：{foundCount}/{total}</p>
    </header>
  );
} 