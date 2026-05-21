'use client'
import { useState, useEffect, useCallback } from 'react'
import { fetchAllOrders, STATUS_OPTIONS, getStatusMeta } from '../../lib/mockApi'

// ─── Color maps ───────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  in_process:  'bg-amber-50  text-amber-700  border-amber-200',
  completed:   'bg-green-50  text-green-700  border-green-200',
  return:      'bg-blue-50   text-blue-700   border-blue-200',
  replacement: 'bg-purple-50 text-purple-700 border-purple-200',
  cancelled:   'bg-red-50    text-red-700    border-red-200',
}

const TABS = [
  { key: 'all',         label: 'All Orders',   filter: () => true                           },
  { key: 'return',      label: 'Returns',       filter: o => o.status === 'return'           },
  { key: 'replacement', label: 'Replacements',  filter: o => o.status === 'replacement'     },
  { key: 'cancelled',   label: 'Cancelled',     filter: o => o.status === 'cancelled'       },
]

// ─── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [form, setForm]     = useState({ contact: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 800))
    if (form.contact === 'admin' && form.password === 'admin123') {
      onLogin()
    } else {
      setError('Invalid credentials. Try admin / admin123')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 mb-5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1" style={{fontFamily:'Instrument Serif,serif'}}>Admin Portal</h1>
          <p className="text-sm text-white/40">Sign in to manage orders</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Contact / Username</label>
            <input
              type="text" placeholder="admin"
              value={form.contact}
              onChange={e => setForm(f => ({...f, contact: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/30 focus:bg-white/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Password</label>
            <input
              type="password" placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({...f, password: e.target.value}))}
              className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/30 focus:bg-white/10 transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-[#0f0f0e] text-sm font-semibold hover:bg-white/90 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>
        <p className="text-center text-xs text-white/20 mt-6">Hint: admin / admin123</p>
      </div>
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ value }) {
  const meta = getStatusMeta(value)
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[value] || ''}`}>
      {meta.label}
    </span>
  )
}

// ─── Order row ────────────────────────────────────────────────────────────────
function OrderRow({ order, onStatusChange }) {
  const [editing, setEditing] = useState(false)
  const [saving,  setSaving]  = useState(false)

  const handleChange = async val => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    onStatusChange(order.id, val)
    setSaving(false); setEditing(false)
  }

  return (
    <tr className="border-b border-white/5 hover:bg-white/3 transition-colors group">
      <td className="px-5 py-4">
        <span className="text-xs font-mono text-white/50">{order.id}</span>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-white font-medium">{order.name}</p>
        <p className="text-xs text-white/35 mt-0.5">{order.contact}</p>
      </td>
      <td className="px-5 py-4 hidden md:table-cell">
        <p className="text-sm text-white/70">{order.product}</p>
        <p className="text-xs text-white/30 mt-0.5">Qty: {order.qty} · ₹{order.amount.toLocaleString()}</p>
      </td>
      <td className="px-5 py-4 hidden lg:table-cell">
        <span className={`text-xs px-2 py-1 rounded-md font-medium ${order.payment === 'COD' ? 'bg-amber-400/10 text-amber-400' : 'bg-green-400/10 text-green-400'}`}>
          {order.payment}
        </span>
      </td>
      <td className="px-5 py-4 text-xs text-white/35 hidden sm:table-cell">{order.date}</td>
      <td className="px-5 py-4">
        {editing ? (
          <div className="flex items-center gap-2">
            <select
              autoFocus
              defaultValue={order.status}
              onChange={e => handleChange(e.target.value)}
              disabled={saving}
              className="text-xs bg-[#1a1a18] border border-white/20 text-white rounded-lg px-2.5 py-1.5 outline-none cursor-pointer disabled:opacity-50"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {saving && <div className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin"/>}
            {!saving && (
              <button onClick={() => setEditing(false)} className="text-white/30 hover:text-white/60 transition-colors text-xs">✕</button>
            )}
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="group/badge flex items-center gap-2">
            <StatusBadge value={order.status} />
            <svg className="opacity-0 group-hover/badge:opacity-100 transition-opacity text-white/40" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        )}
      </td>
    </tr>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('all')
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    fetchAllOrders().then(data => { setOrders(data); setLoading(false) })
  }, [])

  const updateStatus = useCallback((id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }, [])

  const activeTab   = TABS.find(t => t.key === tab)
  const filtered    = orders
    .filter(activeTab.filter)
    .filter(o => !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()) || o.contact.includes(search))

  const counts = {}
  TABS.forEach(t => { counts[t.key] = orders.filter(t.filter).length })

  return (
    <div className="min-h-screen bg-[#0f0f0e]">
      {/* Top bar */}
      <header className="border-b border-white/8 px-6 h-14 flex items-center justify-between sticky top-0 bg-[#0f0f0e]/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white" style={{fontFamily:'Instrument Serif,serif'}}>Brand Admin</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-white/40 text-xs">Orders</span>
        </div>
        <button onClick={onLogout} className="text-xs text-white/30 hover:text-white/60 transition-colors">Sign out</button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders',    value: orders.length,                                        color: 'text-white'         },
            { label: 'In Process',      value: orders.filter(o=>o.status==='in_process').length,     color: 'text-amber-400'     },
            { label: 'Completed',       value: orders.filter(o=>o.status==='completed').length,      color: 'text-green-400'     },
            { label: 'Returns / Repl.', value: orders.filter(o=>['return','replacement'].includes(o.status)).length, color: 'text-blue-400' },
          ].map((c,i) => (
            <div key={i} className="bg-white/4 border border-white/8 rounded-2xl px-5 py-4">
              <p className={`text-2xl font-semibold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-white/35 mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  tab === t.key ? 'bg-white text-[#0f0f0e]' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {t.label}
                <span className={`ml-1.5 text-[10px] ${tab === t.key ? 'text-black/40' : 'text-white/25'}`}>
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>
          <input
            type="text" placeholder="Search by name, ID, contact…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/25 transition-all w-full sm:w-64"
          />
        </div>

        {/* Table */}
        <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <div className="w-4 h-4 border border-white/20 border-t-white/60 rounded-full animate-spin"/>
              <span className="text-white/40 text-sm">Loading orders…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-white/30 text-sm">No orders found.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  {['Order ID','Customer','Product','Payment','Date','Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider
                      first:block hidden sm:table-cell md:table-cell lg:table-cell
                    ">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <OrderRow key={order.id} order={order} onStatusChange={updateStatus} />
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-xs text-white/20 mt-4 text-center">Showing {filtered.length} of {orders.filter(activeTab.filter).length} orders · Click status badge to edit</p>
      </div>
    </div>
  )
}

// ─── Page entry ───────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  return loggedIn
    ? <Dashboard onLogout={() => setLoggedIn(false)} />
    : <LoginScreen onLogin={() => setLoggedIn(true)} />
}