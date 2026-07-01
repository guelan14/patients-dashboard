interface AvatarProps {
  name: string
  src?: string
  className?: string
}

export function Avatar({ name, src, className = 'w-12 h-12' }: AvatarProps) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`

  return (
    <img
      src={src || fallback}
      alt={name}
      className={`rounded-full object-cover ${className}`}
      onError={(e) => {
        e.currentTarget.src = fallback
      }}
    />
  )
}
