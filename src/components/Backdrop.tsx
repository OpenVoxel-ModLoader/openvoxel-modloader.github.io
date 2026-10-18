import { IsoCube } from './Icons';

/** Slowly floating cubes, like the OpenVoxel main menu. Purely decorative. */
const CUBES: { x: number; y: number; s: number; hue: 'green' | 'blue' | 'purple'; d: number; o: number }[] = [
  { x: 6, y: 18, s: 54, hue: 'green', d: 0, o: .55 }, { x: 18, y: 70, s: 34, hue: 'blue', d: 3, o: .45 },
  { x: 30, y: 8, s: 26, hue: 'purple', d: 6, o: .4 }, { x: 74, y: 14, s: 60, hue: 'blue', d: 2, o: .55 },
  { x: 86, y: 60, s: 40, hue: 'green', d: 5, o: .45 }, { x: 64, y: 80, s: 30, hue: 'purple', d: 1, o: .4 },
  { x: 92, y: 30, s: 22, hue: 'green', d: 4, o: .35 }, { x: 44, y: 88, s: 24, hue: 'blue', d: 7, o: .3 },
  { x: 2, y: 52, s: 28, hue: 'purple', d: 8, o: .35 }
];

export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      {CUBES.map((c, i) => (
        <div key={i} className="float" style={{ left: `${c.x}%`, top: `${c.y}%`, opacity: c.o, animationDelay: `-${c.d}s` }}>
          <IsoCube hue={c.hue} size={c.s} />
        </div>
      ))}
    </div>
  );
}
