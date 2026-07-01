import { useEffect, useState } from "react";
import { usePatients } from "./hooks/usePatients";
import { useFavorites } from "./hooks/useFavorites";

import { PatientModal } from "./components/PatientModal/PatientModal";
import type { Patient } from "./types/patient";
import { useToast } from "./hooks/useToast";
import { Toast } from "./components/Toast/Toast";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { PatientGrid } from "./components/PatientGrid/PatientGrid";
import { Button } from './components/ui/Button';



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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoritePatients = filteredPatients.filter((p) => isFavorite(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <header className="bg-black text-white py-3 px-6 sticky top-0 z-40 flex items-center">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black font-bold text-xl leading-none">
            P
          </div>
          <span className="font-bold text-lg tracking-wide hidden sm:block">PatientsApp</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 mt-4 pb-20">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-black">Patient Records</h1>
        </div>

        {/* Toolbar / Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between border-b border-gray-200 pb-6">
          <div className="relative w-full sm:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Filter patients by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-black placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors shadow-sm"
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
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
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
        <h2 className="text-2xl font-bold tracking-tight text-black mb-6">All Patients</h2>
        {filteredPatients.length === 0 && !loading ? (
          <p className="text-gray-500 text-center py-10">No patients found matching "{searchTerm}"</p>
        ) : (
          <PatientGrid
            patients={filteredPatients}
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
      </main>

      {/* Site Footer */}
      <footer className="fixed bottom-0 w-full border-t border-gray-200 bg-white py-4 z-40 ">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500 font-medium">
          <p>PatientsApp Dashboard by Migue</p>
        </div>
      </footer>

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

