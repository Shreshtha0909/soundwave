
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
    { name: 'Liked Songs', icon: Heart, page: 'liked' },
    { name: 'My Playlists', icon: ListMusic, page: 'playlists' },
    { name: 'Profile', icon: UserCircle, page: 'profile' }
  ]

  return (
    <aside className="w-full md:w-64 md:shrink-0 flex flex-col gap-2">

      {/* Navigation */}
      <div className="bg-[#181818] rounded-lg p-4 md:p-5">

        <h1 className="text-xl md:text-2xl font-bold text-green-500 mb-4">
          soundwave.
        </h1>

        <nav className="flex flex-wrap md:flex-col gap-2 md:gap-5">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.page}
                onClick={() => setActivePage(item.page)}
                className={`flex items-center gap-2 md:gap-4 px-3 py-2 rounded-lg text-sm md:text-base transition ${
                  activePage === item.page ||
                  (item.page === 'playlists' && activePage === 'playlist-detail')
                    ? 'text-white bg-[#333333] md:bg-transparent'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Desktop Library */}
      <div className="hidden md:flex bg-[#181818] rounded-lg p-5 flex-1 flex-col">

        <div className="flex justify-between items-center">

          <button
            onClick={() => setActivePage('playlists')}
            className="flex items-center gap-3 text-gray-400 hover:text-white"
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

      </div>

      {/* Mobile Create Playlist */}
      <button
        onClick={onCreatePlaylist}
        className="md:hidden flex items-center justify-center gap-2 bg-[#242424] text-white rounded-lg p-3"
      >
        <Plus size={19} />
        <span>Create playlist</span>
      </button>

    </aside>
  )
}

export default Sidebar
