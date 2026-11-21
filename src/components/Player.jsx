
import { useEffect, useRef, useState } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Maximize2,
  Minimize2,
  Heart,
  Repeat,
  BookOpen,
  ListMusic,
  Trash2,
  X
} from 'lucide-react'

// Original sample lyrics for the Soundwave demo
const demoLyrics = {
  'Midnight Dreams': [
    'The city sleeps beneath the stars',
    'While distant lights reveal who we are',
    'I close my eyes and drift away',
    'Into the dreams that never fade',
    '',
    'Midnight dreams, carry me away',
    'Through the night until the break of day',
    'In this silence, I find my way',
    'Midnight dreams, let me stay'
  ],

  'Ocean Waves': [
    'The ocean whispers to the shore',
    'A thousand stories, maybe more',
    'The waves keep dancing in the light',
    'As day slowly turns into night',
    '',
    'Take me where the waters flow',
    'To a place that only dreamers know',
    'Let the tide carry me away',
    'Where the blue meets the break of day'
  ],

  'Beast Mode': [
    'I feel the fire deep inside',
    'No turning back, no place to hide',
    'Every step, another fight',
    'I keep pushing through the night',
    '',
    'No limits, no excuses',
    'Every challenge makes me stronger',
    'I was built to rise again',
    'This is where my journey begins'
  ]
}

const defaultLyrics = [
  'Every moment tells a story',
  'Every heartbeat finds its sound',
  'Through the silence and the rhythm',
  'A new feeling can be found',
  '',
  'Keep the music playing',
  'Let the melody take flight',
  'Every note becomes a memory',
  'Every dream becomes the night'
]

function formatTime(time) {
  if (!Number.isFinite(time)) return '0:00'

  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function Player({
  track,
  onNext,
  onPrevious,
  onEnded,
  canGoNext = true,
  canGoPrevious = true,
  repeatMode = 'off',
  onRepeatChange,
  isLiked = false,
  onLike,
  queue = [],
  queueIndex = -1,
  onPlayQueueTrack,
  onRemoveQueueTrack
}) {
  const audioRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [showQueue, setShowQueue] = useState(false)

  // Load and play a new track
  useEffect(() => {
    const audio = audioRef.current

    setCurrentTime(0)
    setDuration(0)
    setError('')
    setShowLyrics(false)
    setShowQueue(false)

    if (!track || !audio) {
      setIsPlaying(false)
      return
    }

    audio.src = track.audioUrl
    audio.load()

    const playPromise = audio.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false)
        })
    }
  }, [track])

  // Apply volume and mute settings
  useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.volume = volume
    audioRef.current.muted = isMuted
  }, [volume, isMuted])

  // Playback controls
  async function togglePlay() {
    const audio = audioRef.current

    if (!audio || !track) return

    if (audio.paused) {
      try {
        await audio.play()
        setIsPlaying(true)
        setError('')
      } catch {
        setError('Unable to play this audio.')
        setIsPlaying(false)
      }
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  function handleSeek(event) {
    const audio = audioRef.current
    if (!audio || !duration) return

    const newTime = Number(event.target.value)

    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  function handleVolumeChange(event) {
    const newVolume = Number(event.target.value)

    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  function toggleMute() {
    setIsMuted(previous => !previous)
  }

  function toggleRepeat() {
    if (!onRepeatChange) return

    const nextMode =
      repeatMode === 'off'
        ? 'all'
        : repeatMode === 'all'
          ? 'one'
          : 'off'

    onRepeatChange(nextMode)
  }

  function handleTimeUpdate() {
    if (!audioRef.current) return
    setCurrentTime(audioRef.current.currentTime)
  }

  function handleLoadedMetadata() {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration || 0)
  }

  function handleAudioEnded() {
    setIsPlaying(false)
    setCurrentTime(0)

    if (onEnded) {
      onEnded()
    }
  }

  function handleAudioError() {
    setError('This demo audio could not be loaded.')
    setIsPlaying(false)
  }

  if (!track) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#181818] border-t border-white/10 px-4 py-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          Select a song to start listening
        </div>
      </div>
    )
  }

  const progress = duration
    ? (currentTime / duration) * 100
    : 0

  const lyrics = demoLyrics[track.title] || defaultLyrics

  return (
    <>
      {/* One audio element shared by both player views */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        loop={repeatMode === 'one'}
        preload="metadata"
      />

      {/* FULL-SCREEN NOW PLAYING VIEW */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#303030] via-[#181818] to-black text-white overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-full hover:bg-white/10 transition"
                aria-label="Close expanded player"
              >
                <X size={24} />
              </button>

              <p className="text-sm font-semibold tracking-widest text-gray-300">
                NOW PLAYING
              </p>

              <div className="w-10" />
            </div>

            {/* Artwork and Track Details */}
            <div className="grid md:grid-cols-2 gap-10 items-center">

              <div className="w-full max-w-md mx-auto">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full aspect-square object-cover rounded-xl shadow-2xl"
                />
              </div>

              <div className="w-full">
                <p className="text-sm text-gray-400 mb-2">
                  PLAYING FROM SOUNWAVE
                </p>

                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  {track.title}
                </h1>

                <p className="text-xl text-gray-300 mb-6">
                  {track.artist}
                </p>

                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={onLike}
                    className="text-gray-300 hover:text-[#1ed760] transition"
                    aria-label={isLiked ? 'Unlike song' : 'Like song'}
                  >
                    <Heart
                      size={27}
                      fill={isLiked ? '#1ed760' : 'none'}
                      color={isLiked ? '#1ed760' : 'currentColor'}
                    />
                  </button>

                  <span className="text-sm text-gray-400">
                    {isLiked ? 'Added to Liked Songs' : 'Add to Liked Songs'}
                  </span>
                </div>

                {/* Lyrics */}
                <div className="w-full mb-8">
                  <button
                    type="button"
                    onClick={() => setShowLyrics(previous => !previous)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                      showLyrics
                        ? 'bg-[#1ed760] text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <BookOpen size={18} />
                    {showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
                  </button>

                  {showLyrics && (
                    <div className="mt-4 bg-black/30 rounded-xl p-5 max-h-64 overflow-y-auto">
                      <h3 className="font-bold text-lg mb-4">
                        {track.title}
                      </h3>

                      <div className="space-y-3 text-gray-200 text-base md:text-lg leading-relaxed">
                        {lyrics.map((line, index) => (
                          <p
                            key={index}
                            className={line ? 'font-medium' : 'h-2'}
                          >
                            {line || '\u00A0'}
                          </p>
                        ))}
                      </div>

                      <p className="text-xs text-gray-500 mt-5">
                        Original sample lyrics for the Soundwave demo.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
{/* Playback Queue */}
<div className="w-full mb-8">
  <button
    type="button"
    onClick={() => setShowQueue(previous => !previous)}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
      showQueue
        ? 'bg-[#1ed760] text-black'
        : 'bg-white/10 text-white hover:bg-white/20'
    }`}
  >
    <ListMusic size={18} />
    {showQueue ? 'Hide Queue' : `Playback Queue (${queue.length})`}
  </button>

  {showQueue && (
    <div className="mt-4 bg-black/30 rounded-xl p-5">
      <h3 className="font-bold text-lg mb-4">
        Now Playing & Up Next
      </h3>

      {queue.length === 0 ? (
        <p className="text-gray-400 text-sm">
          Your playback queue is empty.
        </p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {queue.map((song, index) => (
            <div
              key={`${song.id}-${index}`}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                index === queueIndex
                  ? 'bg-[#1ed760]/15 border border-[#1ed760]/30'
                  : 'bg-white/5'
              }`}
            >
              <img
                src={song.image}
                alt={song.title}
                className="w-11 h-11 rounded object-cover"
              />

              <button
                type="button"
                onClick={() => onPlayQueueTrack?.(index)}
                className="flex-1 min-w-0 text-left"
              >
                <p className="font-semibold truncate">
                  {song.title}
                </p>

                <p className="text-xs text-gray-400 truncate">
                  {index === queueIndex
                    ? 'Now Playing'
                    : index < queueIndex
                      ? 'Played'
                      : song.artist}
                </p>
              </button>

              {index === queueIndex && (
                <span className="text-[#1ed760] text-xs font-semibold">
                  PLAYING
                </span>
              )}

              {index > queueIndex && (
                <button
                  type="button"
                  onClick={() => onRemoveQueueTrack?.(index)}
                  className="text-gray-400 hover:text-red-400 p-2"
                  aria-label={`Remove ${song.title} from queue`}
                  title="Remove from queue"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</div>
            {/* Expanded Playback Controls */}
            <div className="max-w-2xl mx-auto mt-12">

              {/* Seek Bar */}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>

                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 accent-[#1ed760] cursor-pointer"
                />

                <span>{formatTime(duration)}</span>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-8 mt-7">

                <button
                  onClick={toggleRepeat}
                  className={`transition ${
                    repeatMode !== 'off'
                      ? 'text-[#1ed760]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  aria-label="Change repeat mode"
                  title={`Repeat: ${repeatMode}`}
                >
                  <Repeat size={21} />
                  {repeatMode === 'one' && (
                    <span className="text-xs ml-1">1</span>
                  )}
                </button>

                <button
                  onClick={onPrevious}
                  disabled={!canGoPrevious}
                  className="text-gray-300 hover:text-white disabled:opacity-30"
                  aria-label="Previous track"
                >
                  <SkipBack size={30} fill="currentColor" />
                </button>

                <button
                  onClick={togglePlay}
                  className="bg-white text-black p-4 rounded-full hover:scale-105 transition"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying
                    ? <Pause size={28} fill="currentColor" />
                    : <Play size={28} fill="currentColor" />
                  }
                </button>

                <button
                  onClick={onNext}
                  disabled={!canGoNext}
                  className="text-gray-300 hover:text-white disabled:opacity-30"
                  aria-label="Next track"
                >
                  <SkipForward size={30} fill="currentColor" />
                </button>

                <button
                  onClick={onLike}
                  className="text-gray-300 hover:text-[#1ed760] transition"
                  aria-label={isLiked ? 'Unlike song' : 'Like song'}
                >
                  <Heart
                    size={21}
                    fill={isLiked ? '#1ed760' : 'none'}
                    color={isLiked ? '#1ed760' : 'currentColor'}
                  />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center justify-center gap-3 mt-8">
                <button onClick={toggleMute} aria-label="Toggle mute">
                  {isMuted || volume === 0
                    ? <VolumeX size={20} />
                    : <Volume2 size={20} />
                  }
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-32 accent-[#1ed760] cursor-pointer"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center mt-5">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* COMPACT BOTTOM PLAYER */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#181818] border-t border-white/10 px-3 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] text-white">

        <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-x-3 gap-y-2">

          {/* Track Information */}
          <div className="flex items-center gap-2 min-w-0 w-[calc(100%-90px)] md:w-1/3">
            <img
              src={track.image}
              alt={track.title}
              className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded object-cover"
            />

            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {track.title}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {track.artist}
              </p>
            </div>

            <button
              onClick={onLike}
              className="ml-1 text-gray-400 hover:text-[#1ed760] transition"
              aria-label={isLiked ? 'Unlike song' : 'Like song'}
            >
              <Heart
                size={18}
                fill={isLiked ? '#1ed760' : 'none'}
                color={isLiked ? '#1ed760' : 'currentColor'}
              />
            </button>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center w-full md:w-auto md:flex-1 md:max-w-xl order-2 md:order-none">

            <div className="flex items-center gap-5 mb-2">
              <button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="text-gray-400 hover:text-white disabled:opacity-30"
                aria-label="Previous track"
              >
                <SkipBack size={19} fill="currentColor" />
              </button>

              <button
                onClick={togglePlay}
                className="bg-white text-black p-2 rounded-full hover:scale-105 transition"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying
                  ? <Pause size={19} fill="currentColor" />
                  : <Play size={19} fill="currentColor" />
                }
              </button>

              <button
                onClick={onNext}
                disabled={!canGoNext}
                className="text-gray-400 hover:text-white disabled:opacity-30"
                aria-label="Next track"
              >
                <SkipForward size={19} fill="currentColor" />
              </button>
            </div>

            {/* Compact Seek Bar */}
            <div className="flex items-center gap-2 w-full text-[10px] text-gray-400">
              <span>{formatTime(currentTime)}</span>

              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 accent-[#1ed760] cursor-pointer"
              />

              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume and Expand */}
          <div className="flex items-center justify-end gap-3 w-[76px] md:w-1/3">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white"
              aria-label="Toggle mute"
            >
              {isMuted || volume === 0
                ? <VolumeX size={19} />
                : <Volume2 size={19} />
              }
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-[#1ed760] cursor-pointer hidden sm:block"
            />

            <button
              onClick={() => setIsExpanded(true)}
              className="text-gray-400 hover:text-white transition"
              aria-label="Expand player"
              title="Open Now Playing"
            >
              <Maximize2 size={19} />
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-xs text-center mt-1">
            {error}
          </p>
        )}
      </div>
    </>
  )
}
