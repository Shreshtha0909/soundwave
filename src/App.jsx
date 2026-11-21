import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  Heart,
  Music2,
  X,
  Plus,
  ListMusic,
  Play,
  Shuffle
} from 'lucide-react'

import Sidebar from './components/Sidebar'
import MusicCard from './components/MusicCard'
import Player from './components/Player'
import Login from './components/Login'
import Signup from './components/Signup'

// --------------------------------------------------
// SAMPLE AUDIO
// --------------------------------------------------

const audioSamples = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
]

// --------------------------------------------------
// MUSIC CATEGORIES
// --------------------------------------------------

const musicCategories = [
  {
    name: 'Chill',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500',
    songs: ['Midnight Dreams', 'Ocean Waves', 'Slow Motion', 'Lost in Thoughts', 'Peaceful Mind']
  },
  {
    name: 'Metal',
    image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500',
    songs: ['Iron Storm', 'Dark Horizon', 'Broken Chains', 'Fire Within', 'Final Battle']
  },
  {
    name: 'Gym',
    image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=500',
    songs: ['Beast Mode', 'No Limits', 'Power Up', 'Unstoppable', 'Rise Again']
  },
  {
    name: 'Classic',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500',
    songs: ['Moonlight Sonata', 'Golden Memories', 'Timeless Melody', 'The Orchestra', 'Silent Symphony']
  },
  {
    name: 'Modern',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500',
    songs: ['Neon Lights', 'City Dreams', 'New Generation', 'Electric Love', 'Summer Nights']
  },
  {
    name: 'Instrumental',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500',
    songs: ['Blue Horizon', 'The Journey', 'Beyond Words', 'Quiet Moments', 'Endless Sky']
  },
  {
    name: 'Electronic',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500',
    songs: ['Digital Pulse', 'Neon Energy', 'Future Bass', 'Night Frequency', 'Cosmic Rhythm']
  },
  {
    name: 'Acoustic',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500',
    songs: ['Wooden Strings', 'Coffee and Rain', 'Home Again', 'Autumn Leaves', 'Simple Things']
  }
]

// --------------------------------------------------
// GENERATE MUSIC LIBRARY
// --------------------------------------------------

const playlists = musicCategories.flatMap((category) =>
  category.songs.map((song, index) => ({
    id: `${category.name}-${index + 1}`,
    title: song,
    artist: 'Soundwave Originals',
    description: `${category.name} music collection`,
    category: category.name,
    image: category.image,
    audioUrl: audioSamples[index % audioSamples.length]
  }))
)

const categoryNames = [
  'All',
  ...musicCategories.map((category) => category.name)
]

// --------------------------------------------------
// LOCAL STORAGE
// --------------------------------------------------

function loadFromStorage(key, fallback = []) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch (error) {
    console.error(`Could not load ${key}:`, error)
    return fallback
  }
}

// --------------------------------------------------
// MAIN APP
// --------------------------------------------------

function App() {
  // Navigation
  const [activePage, setActivePage] = useState('home')

  // Authentication
  const [currentUser, setCurrentUser] = useState(() =>
    loadFromStorage('soundwave-current-user', null)
  )
  const [authMode, setAuthMode] = useState('login')
    // Profile & Settings
  const [profileName, setProfileName] = useState(() =>
    loadFromStorage('soundwave-current-user', null)?.name || ''
  )

  const [profileImage, setProfileImage] = useState(() =>
    loadFromStorage('soundwave-profile-image', '')
  )

  const [theme, setTheme] = useState(() =>
    loadFromStorage('soundwave-theme', 'dark')
  )

  const [autoplay, setAutoplay] = useState(() =>
    loadFromStorage('soundwave-autoplay', true)
  )

  // Music player
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [playbackQueue, setPlaybackQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(-1)
  const [repeatMode, setRepeatMode] = useState('off')

  // Search
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  // Liked songs
  const [likedSongs, setLikedSongs] = useState(() =>
    loadFromStorage('soundwave-liked-songs')
  )

  // Recently Played
const [recentlyPlayed, setRecentlyPlayed] = useState(() =>
  loadFromStorage('soundwave-recently-played')
)

  // User playlists
  const [createdPlaylists, setCreatedPlaylists] = useState(() =>
    loadFromStorage('soundwave-created-playlists')
  )

  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null)

  // Create playlist
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [playlistDescription, setPlaylistDescription] = useState('')
  const [selectedSongIds, setSelectedSongIds] = useState([])

  // Add songs
  const [showAddSongs, setShowAddSongs] = useState(false)
  const [newSongIds, setNewSongIds] = useState([])

  // Edit playlist
  const [showEditPlaylist, setShowEditPlaylist] = useState(false)
  const [editPlaylistName, setEditPlaylistName] = useState('')
  const [editPlaylistDescription, setEditPlaylistDescription] = useState('')
  const [editPlaylistImage, setEditPlaylistImage] = useState('')

  // Currently selected playlist
  const selectedPlaylist = createdPlaylists.find(
    (playlist) => playlist.id === selectedPlaylistId
  )

  // ------------------------------------------------
  // SAVE DATA
  // ------------------------------------------------

  useEffect(() => {
    localStorage.setItem(
      'soundwave-liked-songs',
      JSON.stringify(likedSongs)
    )
  }, [likedSongs])

  useEffect(() => {
  localStorage.setItem(
    'soundwave-recently-played',
    JSON.stringify(recentlyPlayed)
  )
}, [recentlyPlayed])

useEffect(() => {
  if (!selectedTrack) return

  setRecentlyPlayed(previous => [
    selectedTrack,
    ...previous.filter(song => song.id !== selectedTrack.id)
  ].slice(0, 12))
}, [selectedTrack])

  useEffect(() => {
    localStorage.setItem(
      'soundwave-created-playlists',
      JSON.stringify(createdPlaylists)
    )
  }, [createdPlaylists])

  // ------------------------------------------------
  // MUSIC PLAYER
  // ------------------------------------------------

  function playTrack(track, queue = playlists) {
    const trackIndex = queue.findIndex(
      (song) => song.id === track.id
    )

    setPlaybackQueue(queue)
    setQueueIndex(trackIndex)
    setSelectedTrack(track)
  }

  function playNext() {
    if (playbackQueue.length === 0) return

    if (queueIndex < playbackQueue.length - 1) {
      const nextIndex = queueIndex + 1
      setQueueIndex(nextIndex)
      setSelectedTrack(playbackQueue[nextIndex])
    } else if (repeatMode === 'all') {
      setQueueIndex(0)
      setSelectedTrack(playbackQueue[0])
    }
  }

  function playPrevious() {
    if (playbackQueue.length === 0) return

    if (queueIndex > 0) {
      const previousIndex = queueIndex - 1
      setQueueIndex(previousIndex)
      setSelectedTrack(playbackQueue[previousIndex])
    } else if (repeatMode === 'all') {
      const lastIndex = playbackQueue.length - 1
      setQueueIndex(lastIndex)
      setSelectedTrack(playbackQueue[lastIndex])
    }
  }

  function handleTrackEnded() {
    if (repeatMode === 'one') {
      setSelectedTrack((previous) =>
        previous ? { ...previous } : previous
      )
      return
    }

    playNext()
  }

  function playPlaylist(songs) {
    if (!songs || songs.length === 0) return

    setPlaybackQueue(songs)
    setQueueIndex(0)
    setSelectedTrack(songs[0])
  }

  function shufflePlaylist(songs) {
    if (!songs || songs.length === 0) return

    const shuffledSongs = [...songs]

    for (let i = shuffledSongs.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1))

      ;[shuffledSongs[i], shuffledSongs[randomIndex]] =
        [shuffledSongs[randomIndex], shuffledSongs[i]]
    }

    setPlaybackQueue(shuffledSongs)
    setQueueIndex(0)
    setSelectedTrack(shuffledSongs[0])
  }
  // ------------------------------------------------
// PLAYBACK QUEUE
// ------------------------------------------------

function addToQueue(track) {
  setPlaybackQueue((previous) => {
    const nextQueue = [...previous]
    const insertAt = Math.max(queueIndex + 1, 0)

    nextQueue.splice(insertAt, 0, track)
    return nextQueue
  })
}

function playQueueTrack(index) {
  if (index < 0 || index >= playbackQueue.length) return

  setQueueIndex(index)
  setSelectedTrack(playbackQueue[index])
}

function removeQueueTrack(index) {
  // Do not allow removing the current or already-played tracks.
  if (index <= queueIndex) return

  setPlaybackQueue((previous) =>
    previous.filter((_, i) => i !== index)
  )
}

  // ------------------------------------------------
  // LIKE / UNLIKE SONGS
  // ------------------------------------------------

  function toggleLike(track) {
    setLikedSongs((previous) => {
      const alreadyLiked = previous.some(
        (song) => song.id === track.id
      )

      if (alreadyLiked) {
        return previous.filter(
          (song) => song.id !== track.id
        )
      }

      return [...previous, track]
    })
  }

  // ------------------------------------------------
  // CREATE PLAYLIST
  // ------------------------------------------------

  function createPlaylist(event) {
    event.preventDefault()

    const cleanName = playlistName.trim()
    if (!cleanName) return

    const selectedSongs = playlists.filter((track) =>
      selectedSongIds.includes(track.id)
    )

    const newPlaylist = {
      id: Date.now(),
      name: cleanName,
      description: playlistDescription.trim(),
      coverImage: '',
      songs: selectedSongs
    }

    setCreatedPlaylists((previous) => [
      ...previous,
      newPlaylist
    ])

    setPlaylistName('')
    setPlaylistDescription('')
    setSelectedSongIds([])
    setShowCreatePlaylist(false)
    setActivePage('playlists')
  }

  // ------------------------------------------------
  // EDIT PLAYLIST
  // ------------------------------------------------

  function openEditPlaylist() {
    if (!selectedPlaylist) return

    setEditPlaylistName(selectedPlaylist.name)
    setEditPlaylistDescription(selectedPlaylist.description || '')
    setEditPlaylistImage(selectedPlaylist.coverImage || '')
    setShowEditPlaylist(true)
  }

  function savePlaylistDetails(event) {
    event.preventDefault()

    if (!selectedPlaylist) return

    const cleanName = editPlaylistName.trim()
    if (!cleanName) return

    setCreatedPlaylists((previous) =>
      previous.map((playlist) =>
        playlist.id === selectedPlaylist.id
          ? {
              ...playlist,
              name: cleanName,
              description: editPlaylistDescription.trim(),
              coverImage: editPlaylistImage.trim()
            }
          : playlist
      )
    )

    setShowEditPlaylist(false)
  }

  // ------------------------------------------------
  // REMOVE SONG FROM PLAYLIST
  // ------------------------------------------------

  function removeSongFromPlaylist(track) {
    if (!selectedPlaylist) return

    setCreatedPlaylists((previous) =>
      previous.map((playlist) =>
        playlist.id === selectedPlaylist.id
          ? {
              ...playlist,
              songs: playlist.songs.filter(
                (song) => song.id !== track.id
              )
            }
          : playlist
      )
    )
  }

  // ------------------------------------------------
  // DELETE PLAYLIST
  // ------------------------------------------------

  function deletePlaylist() {
    if (!selectedPlaylist) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedPlaylist.name}"?`
    )

    if (!confirmed) return

    setCreatedPlaylists((previous) =>
      previous.filter(
        (playlist) => playlist.id !== selectedPlaylist.id
      )
    )

    setSelectedPlaylistId(null)
    setShowAddSongs(false)
    setShowEditPlaylist(false)
    setNewSongIds([])
    setActivePage('playlists')
  }

  // ------------------------------------------------
  // ADD SONGS TO EXISTING PLAYLIST
  // ------------------------------------------------

  function addSongsToPlaylist() {
    if (!selectedPlaylist || newSongIds.length === 0) return

    const newSongs = playlists.filter(
      (track) =>
        newSongIds.includes(track.id) &&
        !selectedPlaylist.songs.some(
          (song) => song.id === track.id
        )
    )

    const updatedPlaylist = {
      ...selectedPlaylist,
      songs: [...selectedPlaylist.songs, ...newSongs]
    }

    setCreatedPlaylists((previous) =>
      previous.map((playlist) =>
        playlist.id === selectedPlaylist.id
          ? updatedPlaylist
          : playlist
      )
    )

    setNewSongIds([])
    setShowAddSongs(false)
  }

  // ------------------------------------------------
  // SEARCH AND CATEGORY FILTERING
  // ------------------------------------------------

  const searchResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return playlists.filter((track) => {
      const matchesSearch =
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        track.description.toLowerCase().includes(query) ||
        track.category.toLowerCase().includes(query)

      const matchesCategory =
        activeCategory === 'All' ||
        track.category === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory])

  // ------------------------------------------------
  // REUSABLE MUSIC CARD GRID
  // ------------------------------------------------

  function renderMusicCards(tracks, queue = playlists, onRemove) {
    if (tracks.length === 0) {
      return (
        <div className="text-center py-16">
          <Music2
            size={48}
            className="mx-auto text-gray-500 mb-4"
          />

          <h2 className="text-xl font-bold">
            No songs found
          </h2>

          <p className="text-gray-400 mt-2">
            Try selecting another category or searching for something else.
          </p>
        </div>
      )
    }

    return (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
    {tracks.map((track) => (
      <MusicCard
        key={track.id}
        {...track}
        onPlay={() => playTrack(track, queue)}
        onLike={() => toggleLike(track)}
        isLiked={likedSongs.some(
          (song) => song.id === track.id
        )}
        onRemove={
          onRemove
            ? () => onRemove(track)
            : undefined
        }
        onAddToQueue={() => addToQueue(track)}
      />
    ))}
  </div>
)
  }

  // ------------------------------------------------
  // AUTHENTICATION
  // ------------------------------------------------

  function handleAuthSuccess(user) {
    // Keep passwords out of the active session.
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email
    }

    localStorage.setItem(
      'soundwave-current-user',
      JSON.stringify(safeUser)
    )

    setCurrentUser(safeUser)
    setActivePage('home')
  }

  function handleLogout() {
    localStorage.removeItem('soundwave-current-user')
    setCurrentUser(null)
    setAuthMode('login')
  }
    function saveProfile(event) {
    event.preventDefault()

    const cleanName = profileName.trim()
    if (!cleanName) return

    const updatedUser = {
      ...currentUser,
      name: cleanName
    }

    localStorage.setItem(
      'soundwave-current-user',
      JSON.stringify(updatedUser)
    )

    // Update the registered user's name as well.
    const users = loadFromStorage('soundwave-users', [])
    const updatedUsers = users.map((user) =>
      user.id === currentUser.id
        ? { ...user, name: cleanName }
        : user
    )

    localStorage.setItem(
      'soundwave-users',
      JSON.stringify(updatedUsers)
    )

    localStorage.setItem(
      'soundwave-profile-image',
      profileImage.trim()
    )

    setCurrentUser(updatedUser)
    alert('Profile updated successfully!')
  }

  function changeAutoplay(enabled) {
    setAutoplay(enabled)
    localStorage.setItem('soundwave-autoplay', JSON.stringify(enabled))
  }

  function clearRecentlyPlayed() {
    if (!window.confirm('Clear your recently played songs?')) return
    setRecentlyPlayed([])
  }

  function clearLikedSongs() {
    if (!window.confirm('Remove all songs from your Liked Songs?')) return
    setLikedSongs([])
  }

  // ------------------------------------------------
  // PAGE LAYOUT
  // ------------------------------------------------

  if (!currentUser) {
    return authMode === 'signup' ? (
      <Signup
        onSignup={handleAuthSuccess}
        onSwitchToLogin={() => setAuthMode('login')}
      />
    ) : (
      <Login
        onLogin={handleAuthSuccess}
        onSwitchToSignup={() => setAuthMode('signup')}
      />
    )
  }

  return (
    <div className="h-[100dvh] bg-black text-white p-2 flex flex-col gap-2 overflow-hidden">

      <div className="flex flex-1 min-h-0 flex-col md:flex-row gap-2 overflow-hidden">

        {/* SIDEBAR */}

        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          onCreatePlaylist={() => setShowCreatePlaylist(true)}
        />

        {/* MAIN CONTENT */}

        <main className="flex-1 min-w-0 min-h-0 bg-[#121212] rounded-lg p-4 md:p-6 pb-32 md:pb-6 overflow-y-auto">

          {/* CREATE PLAYLIST FORM */}

          {showCreatePlaylist && (
            <section className="max-w-3xl mx-auto mb-10">

              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="text-sm text-[#1ed760] font-semibold mb-2">
                    YOUR LIBRARY
                  </p>

                  <h1 className="text-3xl font-bold">
                    Create Playlist
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreatePlaylist(false)}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close form"
                >
                  <X size={25} />
                </button>
              </div>

              <form onSubmit={createPlaylist}>

                <div className="mb-5">
                  <label className="block font-semibold mb-2">
                    Playlist Name *
                  </label>

                  <input
                    type="text"
                    value={playlistName}
                    onChange={(event) => setPlaylistName(event.target.value)}
                    placeholder="Give your playlist a name"
                    required
                    maxLength={60}
                    className="w-full bg-[#242424] rounded-lg p-4 outline-none focus:ring-2 focus:ring-[#1ed760]"
                  />
                </div>

                <div className="mb-8">
                  <label className="block font-semibold mb-2">
                    Description
                  </label>

                  <textarea
                    value={playlistDescription}
                    onChange={(event) => setPlaylistDescription(event.target.value)}
                    placeholder="Add an optional description"
                    rows={3}
                    maxLength={200}
                    className="w-full bg-[#242424] rounded-lg p-4 outline-none focus:ring-2 focus:ring-[#1ed760] resize-none"
                  />
                </div>

                <h2 className="text-xl font-bold mb-2">
                  Choose Songs
                </h2>

                <p className="text-gray-400 text-sm mb-5">
                  Select the songs you want in your playlist.
                </p>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {playlists.map((track) => (
                    <label
                      key={track.id}
                      className="flex items-center gap-4 bg-[#242424] hover:bg-[#333333] p-3 rounded-lg cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSongIds.includes(track.id)}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setSelectedSongIds((previous) => [
                              ...previous,
                              track.id
                            ])
                          } else {
                            setSelectedSongIds((previous) =>
                              previous.filter((id) => id !== track.id)
                            )
                          }
                        }}
                        className="accent-[#1ed760] w-4 h-4 shrink-0"
                      />

                      <img
                        src={track.image}
                        alt={track.title}
                        className="w-12 h-12 rounded object-cover"
                      />

                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {track.title}
                        </p>

                        <p className="text-sm text-gray-400">
                          {track.category}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <p className="text-gray-400 text-sm mt-4">
                  {selectedSongIds.length} songs selected
                </p>

                <div className="flex flex-wrap gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreatePlaylist(false)
                      setPlaylistName('')
                      setPlaylistDescription('')
                      setSelectedSongIds([])
                    }}
                    className="px-6 py-3 rounded-full bg-[#242424] hover:bg-[#333333] font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-[#1ed760] text-black font-bold hover:scale-105 transition"
                  >
                    Create Playlist
                  </button>
                </div>

              </form>
            </section>
          )}

          {/* HOME PAGE */}

          {activePage === 'home' && (
            <>
              <header className="flex flex-wrap justify-between items-center gap-5 mb-10">
                <div>
                  <p className="text-[#1ed760] font-semibold text-sm mb-2">
                    WELCOME TO SOUNDWAVE
                  </p>

                  <h1 className="text-3xl md:text-4xl font-bold">
                    Good afternoon
                  </h1>

                  <p className="text-gray-400 mt-2">
                    Your music. Your mood. Your world.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-gray-300 text-sm">
                    Hi, {currentUser.name}
                  </span>

                  <button
                    onClick={() => setActivePage('search')}
                    className="bg-white text-black px-5 py-3 rounded-full font-bold hover:scale-105 transition"
                  >
                    Explore Music
                  </button>

                  <button
                    onClick={handleLogout}
                    className="bg-[#242424] text-white px-5 py-3 rounded-full font-semibold hover:bg-[#333333] transition"
                  >
                    Log Out
                  </button>
                </div>
              </header>

              <section>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-bold">
                    Made for you
                  </h2>

                  <button
                    onClick={() => setActivePage('search')}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    See all
                  </button>
                </div>

                {renderMusicCards(playlists.slice(0, 8))}
              </section>

              <section className="mt-12">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-bold">Recently Played</h2>
                </div>

                {recentlyPlayed.length > 0 ? (
                  renderMusicCards(recentlyPlayed)
                ) : (
                  <p className="text-gray-400">
                    Your recently played songs will appear here.
                  </p>
                )}
              </section>

              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-5">
                  Explore Categories
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {musicCategories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => {
                        setActiveCategory(category.name)
                        setSearchQuery('')
                        setActivePage('search')
                      }}
                      className="relative h-32 rounded-xl overflow-hidden text-left group"
                    >
                      <img
                        src={category.image}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition duration-300"
                      />

                      <div className="absolute inset-0 bg-black/30" />

                      <span className="relative z-10 text-xl font-bold p-4 block">
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-5">
                  Popular playlists
                </h2>

                {renderMusicCards([...playlists].reverse().slice(0, 8))}
              </section>
            </>
          )}

          {/* SEARCH PAGE */}

          {activePage === 'search' && (
            <section>
              <p className="text-[#1ed760] font-semibold text-sm mb-2">
                FIND YOUR SOUND
              </p>

              <h1 className="text-3xl font-bold mb-8">
                Search
              </h1>

              <div className="relative max-w-xl mb-6">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="What do you want to listen to?"
                  className="w-full bg-[#242424] text-white rounded-full py-4 pl-12 pr-12 outline-none focus:ring-2 focus:ring-[#1ed760]"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                {categoryNames.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                      activeCategory === category
                        ? 'bg-[#1ed760] text-black'
                        : 'bg-[#242424] text-white hover:bg-[#333333]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <h2 className="text-xl font-bold mb-5">
                {searchQuery.trim() || activeCategory !== 'All'
                  ? 'Search results'
                  : 'Browse all'}
              </h2>

              {renderMusicCards(searchResults)}
            </section>
          )}

          {/* MY PLAYLISTS PAGE */}

          {activePage === 'playlists' && (
            <section>
              <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                  <p className="text-[#1ed760] font-semibold text-sm mb-2">
                    YOUR COLLECTION
                  </p>

                  <h1 className="text-3xl font-bold">
                    My Playlists
                  </h1>
                </div>

                <button
                  onClick={() => setShowCreatePlaylist(true)}
                  className="flex items-center gap-2 bg-[#1ed760] text-black px-5 py-3 rounded-full font-bold hover:scale-105 transition"
                >
                  <Plus size={19} />
                  Create Playlist
                </button>
              </div>

              {createdPlaylists.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">

                  {createdPlaylists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => {
                        setSelectedPlaylistId(playlist.id)
                        setShowAddSongs(false)
                        setShowEditPlaylist(false)
                        setNewSongIds([])
                        setActivePage('playlist-detail')
                      }}
                      className="bg-[#181818] hover:bg-[#282828] p-4 rounded-xl text-left transition group"
                    >

                      {/* PLAYLIST COVER */}

                      <div className="aspect-square rounded-lg overflow-hidden mb-4 relative bg-[#282828]">

                        {playlist.coverImage ? (
                          <img
                            src={playlist.coverImage}
                            alt={playlist.name}
                            className="w-full h-full object-cover"
                          />
                        ) : playlist.songs.length > 0 ? (
                          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                            {playlist.songs.slice(0, 4).map((song) => (
                              <img
                                key={song.id}
                                src={song.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-900">
                            <Music2 size={60} />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                      </div>

                      <h3 className="font-bold truncate">
                        {playlist.name}
                      </h3>

                      <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                        {playlist.description || 'Your personal playlist'}
                      </p>

                      <p className="text-sm text-gray-500 mt-3">
                        {playlist.songs.length} songs
                      </p>

                    </button>
                  ))}

                </div>
              ) : (
                <div className="text-center py-20 bg-[#181818] rounded-xl">
                  <ListMusic
                    size={55}
                    className="mx-auto text-gray-500 mb-5"
                  />

                  <h2 className="text-xl font-bold">
                    No playlists created yet
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Create your first playlist and add your favourite songs.
                  </p>

                  <button
                    onClick={() => setShowCreatePlaylist(true)}
                    className="mt-6 bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition"
                  >
                    Create Playlist
                  </button>
                </div>
              )}
            </section>
          )}

          {/* PLAYLIST NOT FOUND */}

          {activePage === 'playlist-detail' && !selectedPlaylist && (
            <section className="text-center py-20">
              <Music2
                size={50}
                className="mx-auto text-gray-500 mb-4"
              />

              <h1 className="text-2xl font-bold">
                Playlist not found
              </h1>

              <p className="text-gray-400 mt-2">
                This playlist may have been deleted.
              </p>

              <button
                onClick={() => setActivePage('playlists')}
                className="mt-6 bg-white text-black px-6 py-3 rounded-full font-bold"
              >
                Back to Your Library
              </button>
            </section>
          )}

          {/* PLAYLIST DETAILS PAGE */}

          {activePage === 'playlist-detail' && selectedPlaylist && (
            <section>

              <button
                onClick={() => {
                  setActivePage('playlists')
                  setShowAddSongs(false)
                  setShowEditPlaylist(false)
                  setNewSongIds([])
                }}
                className="text-gray-400 hover:text-white mb-6"
              >
                ← Back to My Playlists
              </button>

              {/* PLAYLIST HEADER */}

              <div
                className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-900 rounded-xl p-6 md:p-8 mb-8"
                style={
                  selectedPlaylist.coverImage
                    ? {
                        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.4)), url("${selectedPlaylist.coverImage}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }
                    : {}
                }
              >

                <p className="text-sm font-semibold">
                  YOUR PLAYLIST
                </p>

                <h1 className="text-3xl md:text-4xl font-bold mt-3 break-words">
                  {selectedPlaylist.name}
                </h1>

                <p className="text-white/80 mt-3">
                  {selectedPlaylist.description || 'Your personal playlist'}
                </p>

                <p className="text-white/80 mt-4">
                  {selectedPlaylist.songs.length} songs
                </p>

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => playPlaylist(selectedPlaylist.songs)}
                    disabled={selectedPlaylist.songs.length === 0}
                    className="flex items-center gap-2 bg-[#1ed760] text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Play size={20} fill="black" />
                    Play Playlist
                  </button>

                  <button
                    onClick={() => shufflePlaylist(selectedPlaylist.songs)}
                    disabled={selectedPlaylist.songs.length === 0}
                    className="flex items-center gap-2 bg-black/30 hover:bg-black/50 text-white px-6 py-3 rounded-full font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Shuffle size={20} />
                    Shuffle & Play
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    onClick={openEditPlaylist}
                    className="bg-white/15 hover:bg-white/25 text-white px-5 py-2 rounded-full font-semibold transition"
                  >
                    Edit Playlist
                  </button>

                  <button
                    onClick={deletePlaylist}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold transition"
                  >
                    Delete Playlist
                  </button>
                </div>

              </div>

              {/* EDIT PLAYLIST FORM */}

              {showEditPlaylist && (
                <form
                  onSubmit={savePlaylistDetails}
                  className="bg-[#181818] rounded-xl p-6 mb-8"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                      Edit Playlist
                    </h2>

                    <button
                      type="button"
                      onClick={() => setShowEditPlaylist(false)}
                      className="text-gray-400 hover:text-white"
                      aria-label="Close edit form"
                    >
                      <X size={23} />
                    </button>
                  </div>

                  <div className="mb-5">
                    <label className="block font-semibold mb-2">
                      Playlist Name *
                    </label>

                    <input
                      type="text"
                      value={editPlaylistName}
                      onChange={(event) => setEditPlaylistName(event.target.value)}
                      maxLength={60}
                      required
                      className="w-full bg-[#242424] rounded-lg p-4 outline-none focus:ring-2 focus:ring-[#1ed760]"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="block font-semibold mb-2">
                      Description
                    </label>

                    <textarea
                      value={editPlaylistDescription}
                      onChange={(event) => setEditPlaylistDescription(event.target.value)}
                      maxLength={200}
                      rows={3}
                      className="w-full bg-[#242424] rounded-lg p-4 outline-none focus:ring-2 focus:ring-[#1ed760] resize-none"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block font-semibold mb-2">
                      Cover Image URL
                    </label>

                    <input
                      type="url"
                      value={editPlaylistImage}
                      onChange={(event) => setEditPlaylistImage(event.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-[#242424] rounded-lg p-4 outline-none focus:ring-2 focus:ring-[#1ed760]"
                    />

                    <p className="text-sm text-gray-400 mt-2">
                      Paste a publicly accessible image URL.
                    </p>

                    {editPlaylistImage && (
                      <img
                        src={editPlaylistImage}
                        alt="Playlist cover preview"
                        className="mt-4 w-32 h-32 object-cover rounded-lg"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none'
                        }}
                        onLoad={(event) => {
                          event.currentTarget.style.display = 'block'
                        }}
                      />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditPlaylist(false)}
                      className="px-6 py-3 rounded-full bg-[#242424] hover:bg-[#333333] font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-full bg-[#1ed760] text-black font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* ADD SONGS BUTTON */}

              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => {
                    setShowAddSongs((previous) => !previous)
                    setNewSongIds([])
                  }}
                  className="bg-[#1ed760] text-black px-5 py-3 rounded-full font-bold hover:scale-105 transition"
                >
                  {showAddSongs ? 'Cancel' : '+ Add Songs'}
                </button>
              </div>

              {/* ADD SONGS PANEL */}

              {showAddSongs && (
                <div className="bg-[#181818] rounded-xl p-5 mb-8">

                  <h2 className="text-xl font-bold mb-2">
                    Add songs to {selectedPlaylist.name}
                  </h2>

                  <p className="text-sm text-gray-400 mb-5">
                    Select songs from your Soundwave library.
                  </p>

                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {playlists.map((track) => {
                      const alreadyAdded = selectedPlaylist.songs.some(
                        (song) => song.id === track.id
                      )

                      return (
                        <label
                          key={track.id}
                          className={`flex items-center gap-4 p-3 rounded-lg ${
                            alreadyAdded
                              ? 'opacity-40 cursor-not-allowed'
                              : 'bg-[#242424] hover:bg-[#333333] cursor-pointer'
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={alreadyAdded}
                            checked={
                              alreadyAdded ||
                              newSongIds.includes(track.id)
                            }
                            onChange={(event) => {
                              if (event.target.checked) {
                                setNewSongIds((previous) => [
                                  ...previous,
                                  track.id
                                ])
                              } else {
                                setNewSongIds((previous) =>
                                  previous.filter((id) => id !== track.id)
                                )
                              }
                            }}
                            className="accent-[#1ed760] w-4 h-4 shrink-0"
                          />

                          <img
                            src={track.image}
                            alt={track.title}
                            className="w-12 h-12 rounded object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="font-semibold truncate">
                              {track.title}
                            </p>

                            <p className="text-sm text-gray-400">
                              {track.category}
                            </p>
                          </div>

                          {alreadyAdded && (
                            <span className="text-xs text-gray-500">
                              Added
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>

                  <p className="text-sm text-gray-400 mt-4">
                    {newSongIds.length} new songs selected
                  </p>

                  <button
                    type="button"
                    onClick={addSongsToPlaylist}
                    disabled={newSongIds.length === 0}
                    className="mt-5 bg-[#1ed760] text-black px-6 py-3 rounded-full font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add Selected Songs
                  </button>
                </div>
              )}

              {/* PLAYLIST SONGS */}

              <h2 className="text-2xl font-bold mb-5">
                Songs
              </h2>

              {selectedPlaylist.songs.length > 0 ? (
                renderMusicCards(
                  selectedPlaylist.songs,
                  selectedPlaylist.songs,
                  removeSongFromPlaylist
                )
              ) : (
                <div className="text-center py-14 bg-[#181818] rounded-xl">
                  <Music2
                    size={45}
                    className="mx-auto text-gray-500 mb-4"
                  />

                  <p className="text-gray-400">
                    This playlist is empty. Use Add Songs to get started.
                  </p>
                </div>
              )}

            </section>
          )}

          {/* LIKED SONGS PAGE */}

          {activePage === 'liked' && (
            <section>
              <div className="bg-gradient-to-br from-indigo-600 to-purple-900 rounded-xl p-8 mb-8">
                <Heart
                  size={55}
                  fill="white"
                  className="mb-5"
                />

                <p className="text-sm font-semibold">
                  YOUR COLLECTION
                </p>

                <h1 className="text-4xl md:text-5xl font-bold mt-3">
                  Liked Songs
                </h1>

                <p className="mt-4 text-white/80">
                  {likedSongs.length} liked songs
                </p>
              </div>

              {likedSongs.length > 0 ? (
                renderMusicCards(likedSongs, likedSongs)
              ) : (
                <div className="text-center py-16">
                  <Heart
                    size={48}
                    className="mx-auto text-gray-500 mb-4"
                  />

                  <h2 className="text-xl font-bold">
                    No liked songs yet
                  </h2>

                  <p className="text-gray-400 mt-2">
                    Click the heart on a music card to save your favourites.
                  </p>

                  <button
                    onClick={() => setActivePage('home')}
                    className="mt-6 bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition"
                  >
                    Discover music
                  </button>
                </div>
              )}
            </section>
          )}

          {/* PROFILE & SETTINGS PAGE */}

          {activePage === 'profile' && (
            <section className="max-w-4xl mx-auto">

              {/* PAGE HEADER */}

              <div className="mb-10">
                <p className="text-[#1ed760] font-semibold text-sm mb-2">
                  YOUR ACCOUNT
                </p>

                <h1 className="text-3xl md:text-4xl font-bold">
                  Profile & Settings
                </h1>

                <p className="text-gray-400 mt-2">
                  Manage your profile and listening preferences.
                </p>
              </div>

              {/* PROFILE DETAILS */}

              <div className="bg-[#181818] rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">
                  Profile Details
                </h2>

                <form onSubmit={saveProfile}>

                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">

                    {profileImage.trim() ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none'
                        }}
                        className="w-24 h-24 rounded-full object-cover bg-[#242424]"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[#242424] flex items-center justify-center text-4xl font-bold text-[#1ed760]">
                        {profileName.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}

                    <div className="flex-1 w-full">
                      <label className="block text-sm font-semibold mb-2">
                        Profile Picture URL
                      </label>

                      <input
                        type="url"
                        value={profileImage}
                        onChange={(event) => setProfileImage(event.target.value)}
                        placeholder="https://example.com/profile.jpg"
                        className="w-full bg-[#242424] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#1ed760]"
                      />

                      <p className="text-gray-500 text-xs mt-2">
                        Paste an image URL to use it as your profile picture.
                      </p>
                    </div>

                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-semibold mb-2">
                      Display Name
                    </label>

                    <input
                      type="text"
                      value={profileName}
                      onChange={(event) => setProfileName(event.target.value)}
                      required
                      maxLength={40}
                      className="w-full bg-[#242424] rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#1ed760]"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={currentUser.email}
                      readOnly
                      className="w-full bg-[#242424] text-gray-400 rounded-lg p-3 outline-none cursor-not-allowed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#1ed760] text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition"
                  >
                    Save Profile
                  </button>

                </form>
              </div>

              {/* LISTENING PREFERENCES */}

              <div className="bg-[#181818] rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">
                  Listening Preferences
                </h2>

                <div className="flex flex-wrap justify-between items-center gap-4 py-4">
                  <div>
                    <h3 className="font-semibold">Autoplay</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Automatically play the next song when a track ends.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={autoplay}
                    onChange={(event) => changeAutoplay(event.target.checked)}
                    className="w-5 h-5 accent-[#1ed760] cursor-pointer"
                  />
                </div>
              </div>

              {/* LIBRARY MANAGEMENT */}

              <div className="bg-[#181818] rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold mb-6">
                  Manage Your Library
                </h2>

                <div className="flex flex-wrap justify-between items-center gap-4 py-4 border-b border-[#333333]">
                  <div>
                    <h3 className="font-semibold">Recently Played</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {recentlyPlayed.length} recently played songs
                    </p>
                  </div>

                  <button
                    onClick={clearRecentlyPlayed}
                    className="bg-[#242424] hover:bg-red-600 px-5 py-2 rounded-full text-sm font-semibold transition"
                  >
                    Clear History
                  </button>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-4 py-4">
                  <div>
                    <h3 className="font-semibold">Liked Songs</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {likedSongs.length} liked songs
                    </p>
                  </div>

                  <button
                    onClick={clearLikedSongs}
                    className="bg-[#242424] hover:bg-red-600 px-5 py-2 rounded-full text-sm font-semibold transition"
                  >
                    Clear Liked Songs
                  </button>
                </div>
              </div>

              {/* ACCOUNT */}

              <div className="bg-[#181818] rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold mb-3">
                  Account
                </h2>

                <p className="text-gray-400 text-sm mb-5">
                  Signed in as {currentUser.email}
                </p>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full font-bold transition"
                >
                  Log Out
                </button>
              </div>

            </section>
          )}
        </main>
         </div>

      {/* BOTTOM MUSIC PLAYER */}
      <Player
        track={selectedTrack}
        onNext={playNext}
        onPrevious={playPrevious}
        onEnded={handleTrackEnded}
        canGoNext={
          repeatMode === 'all'
            ? playbackQueue.length > 0
            : queueIndex >= 0 &&
              queueIndex < playbackQueue.length - 1
        }
        canGoPrevious={
          queueIndex > 0 || repeatMode === 'all'
        }
        repeatMode={repeatMode}
        onRepeatChange={setRepeatMode}
        queue={playbackQueue}
        queueIndex={queueIndex}
        onPlayQueueTrack={playQueueTrack}
        onRemoveQueueTrack={removeQueueTrack}
      />
    </div>
  )
}
export default App