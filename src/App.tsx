import { useEffect } from "react";
import { usePatients } from "./hooks/usePatients";
import { PatientCard } from "./components/patientCard/PatientCard";
import { SkeletonCard } from "./components/Skeleton/SkeletonCard";
import { useFavorites } from "./hooks/useFavorites";

function App() {
  const { patients, loading, error, loadMore, refresh, hasMore } =
    usePatients();

  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    refresh();
  }, []);

  const favoritePatients = patients.filter((p) => isFavorite(p.id));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* Favorites section */}
      {favoritePatients.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Favorites ({favoritePatients.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoritePatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                isFavorite={isFavorite(patient.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* All patients */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Records</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            isFavorite={isFavorite(patient.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      {loading && <p className="text-center mt-4 text-gray-400">Cargando...</p>}
      {error && <p className="text-center mt-4 text-red-400">{error}</p>}
      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
