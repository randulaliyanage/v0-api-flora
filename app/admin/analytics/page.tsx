"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts"
import { TrendingUp, ShoppingBag, Coins, Repeat, Flower2, MapPin } from "lucide-react"
import { analytics, formatLKR } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="label-eyebrow mb-1">Performance</p>
        <h2 className="font-serif text-2xl italic text-foreground">Analytics & insights</h2>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Revenue"
          value={formatLKR(analytics.totalRevenueLKR)}
          sub="This month"
          icon={<Coins className="h-4 w-4" />}
        />
        <MetricCard
          label="Orders"
          value={analytics.ordersThisMonth.toString()}
          sub="This month"
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <MetricCard
          label="Avg. Order Value"
          value={formatLKR(analytics.avgOrderValueLKR)}
          sub="Per bouquet"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          label="Return Rate"
          value={`${Math.round(analytics.returnRate * 100)}%`}
          sub="Customers reorder"
          icon={<Repeat className="h-4 w-4" />}
          accent
        />
      </div>

      {/* Charts grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders bar chart */}
        <div className="rounded-3xl border border-border-subtle bg-white p-6 lg:col-span-2">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="label-eyebrow mb-1">Orders</p>
              <h3 className="font-serif text-xl italic text-foreground">Last 14 days</h3>
            </div>
            <div className="hidden items-center gap-2 text-xs text-text-muted md:flex">
              <span className="h-2 w-2 rounded-full bg-rose-velvet" />
              Daily orders
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.ordersLast14Days} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ede5e6" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#70585b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#70585b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(248, 216, 219, 0.4)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #ede5e6",
                    backgroundColor: "#fcf9f5",
                    fontSize: "12px",
                    boxShadow: "0 8px 24px -8px rgba(153,0,72,0.15)",
                  }}
                  labelStyle={{ color: "#70585b", fontWeight: 500 }}
                />
                <Bar dataKey="orders" fill="#990048" radius={[8, 8, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut chart — Flower Popularity */}
        <div className="rounded-3xl border border-border-subtle bg-white p-6">
          <p className="label-eyebrow mb-1">Flower Popularity</p>
          <h3 className="mb-2 font-serif text-xl italic text-foreground">What's blooming</h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.flowerPopularity}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="none"
                >
                  {analytics.flowerPopularity.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #ede5e6",
                    backgroundColor: "#fcf9f5",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {analytics.flowerPopularity.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                    aria-hidden
                  />
                  <span className="text-foreground">{entry.name}</span>
                </div>
                <span className="tabular-nums text-text-muted">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue trend area chart */}
      <div className="rounded-3xl border border-border-subtle bg-white p-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="label-eyebrow mb-1">Revenue</p>
            <h3 className="font-serif text-xl italic text-foreground">14-day revenue trend</h3>
          </div>
          <div className="hidden items-center gap-2 text-xs text-text-muted md:flex">
            <span className="h-2 w-2 rounded-full bg-rose-velvet" />
            Daily revenue (LKR)
          </div>
        </div>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.revenueTrend} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#990048" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#990048" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ede5e6" vertical={false} />
              <XAxis dataKey="day" stroke="#70585b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#70585b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                cursor={{ stroke: "#990048", strokeWidth: 1, strokeDasharray: "3 3" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #ede5e6",
                  backgroundColor: "#fcf9f5",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [formatLKR(value), "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#990048"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <HighlightCard
          icon={<Flower2 className="h-5 w-5" />}
          eyebrow="Top Flower"
          title={analytics.topFlower}
          subtitle="Most ordered this month — 35% of bouquets featured this stem."
        />
        <HighlightCard
          icon={<MapPin className="h-5 w-5" />}
          eyebrow="Top Delivery Zone"
          title={analytics.topZone}
          subtitle="Highest delivery volume neighborhood for the past 30 days."
        />
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string
  value: string
  sub: string
  icon: React.ReactNode
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border-subtle bg-white p-6",
        accent && "bg-petal-pink/40",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="label-eyebrow">{label}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-velvet/10 text-rose-velvet">
          {icon}
        </span>
      </div>
      <p className="mt-4 font-serif text-3xl text-rose-velvet">{value}</p>
      <p className="mt-1 text-xs text-text-muted">{sub}</p>
    </div>
  )
}

function HighlightCard({
  icon,
  eyebrow,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <div className="flex items-start gap-5 rounded-3xl border border-border-subtle bg-white p-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-petal-pink text-rose-velvet">
        {icon}
      </span>
      <div>
        <p className="label-eyebrow mb-1">{eyebrow}</p>
        <h3 className="font-serif text-2xl italic text-foreground">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-text-muted">{subtitle}</p>
      </div>
    </div>
  )
}
