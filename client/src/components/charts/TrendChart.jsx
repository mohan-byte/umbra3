import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function dayLabel(iso) {
  const d = new Date(iso);
  const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${M[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function TrendChart({ data, dataKey = "count", label = "Victims", color = "#7c5cff", height = 200 }) {
  const rows = data.map((d) => ({ ...d, label: dayLabel(d.date) }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={rows} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.5} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#6d7691", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={24} />
        <YAxis tick={{ fill: "#6d7691", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
        <Tooltip
          contentStyle={{ background: "#0e1019", border: "1px solid #1f2333", borderRadius: 12, color: "#eef1f8", fontSize: 12 }}
          labelStyle={{ color: "#aab3c8" }} cursor={{ stroke: "#2b3042" }}
        />
        <Area type="monotone" dataKey={dataKey} name={label} stroke={color} strokeWidth={2} fill={`url(#grad-${label})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
