
import { useState } from 'react'
import { Music2, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter both email and password.')
      return
    }

    const users = JSON.parse(
      localStorage.getItem('soundwave-users') || '[]'
    )

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    )

    if (!user) {
      setError('Invalid email or password.')
      return
    }

    onLogin(user)
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Music2 size={32} className="text-green-500" />
          <h1 className="text-3xl font-bold">Soundwave</h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          Welcome back
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Log in to continue listening.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <div className="flex items-center gap-3 bg-[#27272a] rounded-lg px-3">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <div className="flex items-center gap-3 bg-[#27272a] rounded-lg px-3">
              <Lock size={18} className="text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent py-3 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full transition"
          >
            Log In
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-green-400 hover:underline font-semibold"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}
