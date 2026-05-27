const palette = [
  "from-cyan-400/80 to-sky-500/80 text-white",
  "from-emerald-400/80 to-teal-500/80 text-white",
  "from-indigo-400/80 to-blue-500/80 text-white",
  "from-amber-300/90 to-orange-400/90 text-slate-900",
  "from-slate-400/80 to-slate-500/80 text-white"
];

const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const hashName = (name = "") => {
  return Array.from(String(name)).reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

const ConnectionAvatar = ({ name, size = "md" }) => {
  const color = palette[hashName(name) % palette.length];
  const sizeClass = size === "lg" ? "w-12 h-12 text-label-sm" : "w-10 h-10 text-label-sm";

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-semibold shadow-sm`}>
      {initials(name)}
    </div>
  );
};

export default ConnectionAvatar;
