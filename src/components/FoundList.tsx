import React from "react";
import { spots } from "../data/spots";
import type { Spot } from "../data/spots";

interface Props {
  found: number[];
  spots: Spot[];
}
export default function FoundList({ found, spots }: Props) {
  return (
    <div>
      <h3>見つけたまちがい</h3>
      <ul>
        {found.map(id => {
          const spot = spots.find(s => s.id === id);
          return <li key={id}>{spot?.desc}</li>;
        })}
      </ul>
    </div>
  );
} 