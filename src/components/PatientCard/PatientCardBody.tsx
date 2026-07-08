interface PatientCardBodyProps {
  description: string
  website: string
  createdAt: string
  expanded: boolean
}

export function PatientCardBody({ description, website, createdAt, expanded }: PatientCardBodyProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  return (
    <div
      className={`transition-all duration-300 ${expanded ? 'max-h-[400px] mt-4 overflow-y-auto pr-2' : 'max-h-0 overflow-hidden'}`}
    >
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{description}</p>
      
      <div className="flex flex-col gap-1 mt-2 pt-3 border-t border-gray-100 dark:border-slate-700">
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-black dark:text-white font-medium hover:underline break-all w-fit"
        >
          {website}
        </a>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Registered: {formattedDate}</p>
      </div>
    </div>
  )
}
