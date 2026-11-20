
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  ListMusic,
  UserCircle
} from 'lucide-react'

function Sidebar({ activePage, setActivePage, onCreatePlaylist }) {
  const navItems = [
    { name: 'Home', icon: Home, page: 'home' },
    { name: 'Search', icon: Search, page: 'search' },
    { name: 'Profile & Settings', icon: UserCircle, page: 'profile' }
  ]

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-2">

      {/* Navigation */}
      <div className="bg-[#181818] rounded-lg p-5 space-y-6">

        <h1 className="text-2xl font-bold text-green-500">
          soundwave.
        </h1>

        <nav className="space-y-5">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.page}
                onClick={() => setActivePage(item.page)}
                className={`flex items-center gap-4 w-full transition ${
                  activePage === item.page
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={22} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Library */}
      <div className="bg-[#181818] rounded-lg p-5 flex-1">

        <div className="flex justify-between items-center">

          <button
            onClick={() => setActivePage('playlists')}
            className={`flex items-center gap-3 transition ${
              activePage === 'playlists' ||
              activePage === 'playlist-detail'
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Library size={22} />
            <span className="font-semibold">Your Library</span>
          </button>

          <button
            onClick={onCreatePlaylist}
            className="text-gray-400 hover:text-white"
            aria-label="Create playlist"
          >
            <Plus size={20} />
          </button>

        </div>

        {/* Create Playlist */}
        <div className="mt-8 bg-[#242424] rounded-lg p-4">

          <h3 className="font-semibold">
            Create your first playlist
          </h3>

          <p className="text-sm text-gray-400 mt-2">
            It's easy, we'll help you
          </p>

          <button
            onClick={onCreatePlaylist}
            className="mt-4 bg-white text-black rounded-full px-4 py-2 text-sm font-bold hover:scale-105 transition"
          >
            Create playlist
          </button>

        </div>

        {/* Liked Songs */}
        <button
          onClick={() => setActivePage('liked')}
          className={`flex items-center gap-3 mt-6 transition ${
            activePage === 'liked'
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart size={20} />
          <span>Liked Songs</span>
        </button>

        {/* My Playlists */}
        <button
          onClick={() => setActivePage('playlists')}
          className={`flex items-center gap-3 mt-5 transition ${
            activePage === 'playlists' ||
            activePage === 'playlist-detail'
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ListMusic size={20} />
          <span>My Playlists</span>
        </button>

      </div>
    </aside>
  )
}

export default Sidebar
