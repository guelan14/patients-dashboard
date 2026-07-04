import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button/Button';
import { fetchPatientById } from '../services/api';
import type { Patient } from '../types/patient';
import { ErrorMessage } from '../components/ui/ErrorMessage/ErrorMessage';
import { PatientProfile } from '../components/PatientProfile/PatientProfile';
import { PatientProfileSkeleton } from '../components/Skeleton/PatientProfileSkeleton';
import { useFavorites } from '../hooks/useFavorites';
import { PatientModal } from '../components/PatientModal/PatientModal';
import { useToast } from '../hooks/useToast';
import { Modal } from '../components/ui/Modal/Modal';

export function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isFavorite, toggleFavorite } = useFavorites();
  const [modalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const loadPatient = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPatientById(id);
        if (isMounted) setPatient(data);
      } catch (err) {
        if (isMounted) setError("Could not load patient information.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPatient();
    return () => { isMounted = false; };
  }, [id]);

  const handleEdit = () => {
    setModalOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(false);
    showToast("Paciente eliminado", "success");
    // Simulate API delay
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleSave = (data: Omit<Patient, "id" | "createdAt">) => {
    try {
      if (patient) {
        setPatient({ ...patient, ...data });
        showToast('Patient updated successfully', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      showToast('An error occurred while saving the patient', 'error');
    }
  };

  if (error || (!patient && !loading)) {
    return <ErrorMessage message={error || "Paciente no encontrado"} />;
  }

  return (
    <>
      <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link to="/">
          <Button variant="outline" className="mb-6 group hover:border-black dark:hover:border-white transition-colors">
            <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Volver al Dashboard
          </Button>
        </Link>

        {loading ? <PatientProfileSkeleton /> : (patient && (
          <PatientProfile
            patient={patient}
            isFavorite={isFavorite(patient.id)}
            onToggleFavorite={toggleFavorite}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <PatientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        patient={patient}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Patient"
      >
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete this patient? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            className="bg-red-500 hover:bg-red-600 text-white border-transparent"
          >
            Eliminar
          </Button>
        </div>
      </Modal>

    </>
  );
}
