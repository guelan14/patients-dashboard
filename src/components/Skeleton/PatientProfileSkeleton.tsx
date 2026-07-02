export function PatientProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8 md:p-12 shadow-sm overflow-hidden relative animate-pulse">
      {/* Background gradient decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gray-100 to-transparent dark:from-slate-800 dark:to-transparent rounded-bl-full opacity-50 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
        <div className="shrink-0 relative">
          <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-slate-700 border-4 border-white dark:border-slate-900 shadow-xl" />
        </div>
        
        <div className="flex-1 space-y-6 w-full">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded-full w-24" />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/6" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50">
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20 mb-3" />
              <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
