import { useCallback, useEffect, useState } from 'react';
import type { Patient } from '../types/patient';
import { readArchivedPatients, restoreArchivedPatient } from '../services/api';

export function useArchivedPatients() {
  const [archivedPatients, setArchivedPatients] = useState<Patient[]>(() => readArchivedPatients());

  useEffect(() => {
    const handleArchiveUpdate = () => {
      setArchivedPatients(readArchivedPatients());
    };

    window.addEventListener('patients-archive-updated', handleArchiveUpdate);
    return () => window.removeEventListener('patients-archive-updated', handleArchiveUpdate);
  }, []);

  const restorePatient = useCallback((patientId: string) => {
    const restoredPatient = restoreArchivedPatient(patientId);
    setArchivedPatients(readArchivedPatients());
    return restoredPatient;
  }, []);

  return {
    archivedPatients,
    restorePatient,
  };
}