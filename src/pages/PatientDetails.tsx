import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button/Button';
import { deletePatientById, fetchPatientById, restoreArchivedPatient, isPatientArchived } from '../services/api';
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
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
        if (isMounted) {
          setError(err instanceof Error && err.message === 'Patient not found'
            ? 'Patient not found'
            : 'Could not load patient information.');
        }
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

  const isArchived = patient ? isPatientArchived(patient.id) : false;

  const confirmAction = () => {
    if (!patient) return;
    
    if (isArchived) {
      restoreArchivedPatient(patient.id);
      showToast("Patient restored successfully", "success");
      setIsConfirmModalOpen(false);
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } else {
      deletePatientById(patient);
      showToast("Patient archived successfully", "success");
      setIsConfirmModalOpen(false);
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };

  const handleDelete = () => {
    setIsConfirmModalOpen(true);
  };

  const handleRestore = () => {
    setIsConfirmModalOpen(true);
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
    return <ErrorMessage message={error || "Patient not found"} />;
  }

  return (
    <>
      <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {loading ? <PatientProfileSkeleton /> : (patient && (
          <PatientProfile
            patient={patient}
            isFavorite={isFavorite(patient.id)}
            isArchived={isArchived}
            onToggleFavorite={toggleFavorite}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
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
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title={isArchived ? "Restore Patient" : "Archive Patient"}
      >
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {isArchived
            ? "Are you sure you want to restore this patient to the main list?"
            : "Are you sure you want to archive this patient? You can restore it later from the Archived Patients section."}
        </p>
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            className={isArchived ? "bg-green-500 hover:bg-green-600 text-white border-transparent" : "bg-red-500 hover:bg-red-600 text-white border-transparent"}
          >
            {isArchived ? "Restore" : "Archive"}
          </Button>
        </div>
      </Modal>

    </>
  );
}
