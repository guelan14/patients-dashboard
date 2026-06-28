import { useEffect, useState } from "react";
import { usePatients } from "./hooks/usePatients";
import { PatientCard } from "./components/PatientCard/PatientCard";
import { SkeletonCard } from "./components/Skeleton/SkeletonCard";
import { useFavorites } from "./hooks/useFavorites";
import { PatientModal } from "./components/PatientModal/PatientModal";
import type { Patient } from "./types/patient";
import { useToast } from "./hooks/useToast";
import { Toast } from "./components/Toast/Toast";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";

function App() {
  const {
    patients,
    loading,
    error,
    loadMore,
    hasMore,
    refresh,
    addPatient,
    updatePatient,
  } = usePatients();

  const { triggerRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading,
  })

  const { toast, showToast, hideToast } = useToast()

  const [modalOpen, setModalOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = () => {
    setSelectedPatient(null);
    setModalOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Patient, "id" | "createdAt">) => {
    try {
      if (selectedPatient) {
        updatePatient({ ...selectedPatient, ...data });
        showToast('Patient updated successfully', 'success');
      } else {
        addPatient(data);
        showToast('Patient added successfully', 'success');
      }
      setModalOpen(false);
    } catch (error) {
      showToast('An error occurred while saving the patient', 'error');
    }
  };

  const favoritePatients = patients.filter((p) => isFavorite(p.id));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient Records</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
        >
          + Add Patient
        </button>
      </div>

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
                onEdit={handleEdit}
              />
            ))}
          </div>
        </div>
      )}

      {/* All patients */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Patients</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            isFavorite={isFavorite(patient.id)}
            onToggleFavorite={toggleFavorite}
            onEdit={handleEdit}
          />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      {loading && <p className="text-center mt-4 text-gray-400">Cargando...</p>}
      {error && <p className="text-center mt-4 text-red-400">{error}</p>}
      {hasMore && !loading && (
        <div className="flex justify-center mt-6">
          <div ref={triggerRef} className="h-4" />
        </div>
      )}
      <PatientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        patient={selectedPatient}
      />
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default App;
