import { MapPin } from "lucide-react";
import { WILAYAS } from "@/lib/dz";

export function CitySelect({
  value,
  onChange,
  placeholder,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  id?: string;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
      <MapPin className="h-5 w-5 shrink-0 text-primary" />
      <select
        id={id}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm font-medium outline-none"
      >
        <option value="">{placeholder}</option>
        {WILAYAS.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>
    </label>
  );
}
