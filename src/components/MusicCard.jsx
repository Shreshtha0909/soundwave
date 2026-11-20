
import { Play, Heart, Trash2 } from 'lucide-react'

function MusicCard({
  title,
  description,
  image,
  onPlay,
  onLike,
  isLiked,
  onRemove
}) {
  return (
    <div className="bg-[#181818] hover:bg-[#282828] p-4 rounded-lg transition duration-300 group">

      <div className="relative">

        {/* SONG IMAGE */}

        <img
          src={image}
          alt={title}
          className="w-full aspect-square object-cover rounded-md shadow-lg"
        />

        {/* PLAY BUTTON */}

        <button
          type="button"
          onClick={onPlay}
          className="absolute bottom-3 right-3 bg-[#1ed760] text-black p-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition shadow-lg"
          aria-label={`Play ${title}`}
        >
          <Play size={22} fill="black" />
        </button>

        {/* LIKE BUTTON */}

        <button
          type="button"
          onClick={onLike}
          className="absolute top-3 right-3 bg-black/70 p-2 rounded-full hover:scale-110 transition"
          aria-label={isLiked ? `Unlike ${title}` : `Like ${title}`}
        >
          <Heart
            size={20}
            fill={isLiked ? '#1ed760' : 'none'}
            color={isLiked ? '#1ed760' : 'white'}
          />
        </button>

        {/* REMOVE FROM PLAYLIST BUTTON */}

        {onRemove && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onRemove()
            }}
            className="absolute bottom-3 left-3 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition shadow-lg"
            aria-label={`Remove ${title} from playlist`}
            title="Remove from playlist"
          >
            <Trash2 size={20} />
          </button>
        )}

      </div>

      {/* SONG DETAILS */}

      <h3 className="font-bold mt-4 truncate">
        {title}
      </h3>

      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
        {description}
      </p>

    </div>
  )
}

export default MusicCard
