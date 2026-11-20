
import { useState } from 'react'
import { Music2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function Signup({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const users = JSON.parse(
      localStorage.getItem('soundwave-users') || '[]'
    )

    const emailExists = users.some(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase()
    )

    if (emailExists) {
      setError('An account with this email already exists.')
      return
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    }

    localStorage.setItem(
      'soundwave-users',
      JSON.stringify([...users, newUser])
    )

    onSignup(newUser)
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Music2 size={32} className="text-green-500" />
          <h1 className="text-3xl font-bold">Soundwave</h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          Create your account
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Join Soundwave and enjoy your music.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Full name</label>
            <div className="flex items-center gap-3 bg-[#27272a] rounded-lg px-3">
              <User size={18} className="text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

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
                placeholder="At least 6 characters"
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

          <div>
            <label className="block text-sm mb-2">Confirm password</label>
            <div className="flex items-center gap-3 bg-[#27272a] rounded-lg px-3">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full transition"
          >
            Create Account
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-green-400 hover:underline font-semibold"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  )
}
