/**
 * Analytics Page — Standalone analytics page (/dashboard/analytics).
 *
 * Displays visitor statistics including:
 * - Total views, period views (7/14/30 days), and unique visitors
 * - Daily views bar chart
 * - Top referrer sources
 * - Most visited pages
 */
"use client";
import { useState, useEffect } from "react";
import { Eye, Users, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [days, setDays] = useState(7);

  useEffect(() => { fetch(`/api/dashboard/analytics?days=${days}`).then(r => r.json()).then(setData); }, [days]);

  if (!data) return <div className="text-gray-500">Loading...</div>;

  const maxViews = Math.max(...(data.dailyViews || []).map((d: any) => d.views), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif-accent text-2xl font-bold">Analytics</h1>
        {/* Period selector */}
        <div className="flex rounded-xl bg-white/30 border border-white/50 p-0.5">
          {[7, 14, 30].map(d => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${days === d ? "bg-[--accent-rose] text-white" : "text-gray-500"}`}>
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Eye, label: "Total Views", value: data.totalViews },
          { icon: TrendingUp, label: `Last ${days} Days`, value: data.periodViews },
          { icon: Users, label: "Unique Visitors", value: data.uniqueVisitors },
        ].map(m => (
          <div key={m.label} className="glass rounded-2xl p-5 border border-white/40">
            <div className="w-8 h-8 rounded-xl bg-[--accent-rose-light] text-[--accent-rose] flex items-center justify-center mb-3"><m.icon size={16} /></div>
            <div className="text-2xl font-bold">{m.value}</div>
            <div className="text-xs text-gray-500 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Daily views bar chart */}
      <div className="glass rounded-2xl p-5 border border-white/40 mb-6">
        <h3 className="text-sm font-semibold mb-4">Daily Views</h3>
        <div className="flex items-end gap-1 h-32">
          {(data.dailyViews || []).map((d: any, i: number) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t bg-[--accent-rose] opacity-70 transition-all" style={{ height: `${(d.views / maxViews) * 100}%`, minHeight: d.views > 0 ? 4 : 0 }} />
              <span className="text-[9px] text-gray-400">{new Date(d.date).getDate()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Referrers and top pages */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5 border border-white/40">
          <h3 className="text-sm font-semibold mb-3">Referrer Sources</h3>
          {(data.referrers || []).length === 0 ? <p className="text-xs text-gray-400">No data</p> :
            (data.referrers || []).map((r: any, i: number) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-white/20 last:border-0">
                <span className="text-gray-600 truncate">{r.referrer || "Direct"}</span>
                <span className="font-medium text-gray-800">{r._count}</span>
              </div>
            ))}
        </div>
        <div className="glass rounded-2xl p-5 border border-white/40">
          <h3 className="text-sm font-semibold mb-3">Most Visited Pages</h3>
          {(data.topPages || []).length === 0 ? <p className="text-xs text-gray-400">No data</p> :
            (data.topPages || []).map((p: any, i: number) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-white/20 last:border-0">
                <span className="text-gray-600 truncate">{p.path}</span>
                <span className="font-medium text-gray-800">{p._count}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
