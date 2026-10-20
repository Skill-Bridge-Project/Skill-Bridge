import { Star } from 'lucide-react';

export default function Stars({ value = 0, onChange, size = 'size-4' }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} disabled={!onChange} onClick={() => onChange?.(n)} aria-label={`${n} star`} className={onChange ? 'cursor-pointer' : 'cursor-default'}>
          <Star className={`${size} ${n <= Math.round(value) ? 'fill-amber-500 text-amber-500' : 'text-base-300'}`} />
        </button>
      ))}
    </span>
  );
}
