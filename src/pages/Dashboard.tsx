import { useState, useEffect } from "react";
import { usePatients } from "../hooks/usePatients";
import { useFavorites } from "../hooks/useFavorites";
import { PatientModal } from "../components/PatientModal/PatientModal";
import type { Patient } from "../types/patient";
import { useToast } from "../hooks/useToast";
import { Toast } from "../components/ui/Toast/Toast";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { PatientGrid } from "../components/PatientGrid/PatientGrid";
import { Button } from '../components/ui/Button/Button';
import { Input } from '../components/ui/Input/Input';

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    patients,
    loading,
    error,
    loadMore,
    hasMore,
    refresh,
    addPatient,
    updatePatient,
  } = usePatients(searchTerm);

  const { triggerRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading,
  })

  const { toast, showToast, hideToast } = useToast()

  const [modalOpen, setModalOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

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
    <>
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">Patient Records</h1>
        </div>

        {/* Toolbar / Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between border-b border-gray-200 dark:border-slate-700 pb-6">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Filter patients by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 shadow-sm"
            />
          </div>

          <Button
            onClick={handleAdd}
            className="whitespace-nowrap shrink-0"
          >
            + Add Patient
          </Button>
        </div>

        {/* Favorites section */}
        {favoritePatients.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Favorites ({favoritePatients.length})
            </h2>
            <PatientGrid
              patients={favoritePatients}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onEdit={handleEdit}
            />
          </div>
        )}

        {/* All patients */}
        <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-6">All Patients</h2>
        {patients.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl bg-gray-50 dark:bg-slate-900/50">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No se encontraron pacientes</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              No hay resultados que coincidan con la búsqueda "{searchTerm}". Intenta usar otros términos.
            </p>
            <Button 
              onClick={() => setSearchTerm("")} 
              variant="outline" 
              className="mt-6"
            >
              Limpiar búsqueda
            </Button>
          </div>
        ) : (
          <PatientGrid
            patients={patients}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onEdit={handleEdit}
            loading={loading}
          />
        )}

        {loading && <p className="text-center mt-4 text-gray-400">Cargando...</p>}
        {error && <p className="text-center mt-4 text-red-400">{error}</p>}

        {hasMore && !loading && (
          <div className="flex justify-center mt-6 mb-8">
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
    </>
  );
}
