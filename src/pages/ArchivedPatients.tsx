import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useArchivedPatients } from '../hooks/useArchivedPatients';
import { Avatar } from '../components/ui/Avatar/Avatar';
import { Button } from '../components/ui/Button/Button';
import { Input } from '../components/ui/Input/Input';
import { SearchIcon } from '../components/ui/Icons/Icons';
import { useToast } from '../hooks/useToast';
import { Modal } from '../components/ui/Modal/Modal';

export function ArchivedPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patientToRestore, setPatientToRestore] = useState<string | null>(null);
  const { archivedPatients, restorePatient } = useArchivedPatients();
  const { showToast } = useToast();

  const visibleArchivedPatients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return archivedPatients;
    }

    return archivedPatients.filter((patient) => patient.name.toLowerCase().includes(normalizedSearch));
  }, [archivedPatients, searchTerm]);

  const handleRestore = (patientId: string) => {
    setPatientToRestore(patientId);
  };

  const confirmRestore = () => {
    if (!patientToRestore) return;
    
    const restored = restorePatient(patientToRestore);

    if (restored) {
      showToast('Patient restored successfully', 'success');
    }
    
    setPatientToRestore(null);
  };

  return (
    <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white">Archived Patients</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Search archived patients and restore them anytime.</p>
        </div>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between border-b border-gray-200 dark:border-slate-700 pb-6">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search archived patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 shadow-sm"
          />
        </div>

        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
          {visibleArchivedPatients.length} archived
        </div>
      </div>

      {visibleArchivedPatients.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-8 text-center text-gray-500 dark:text-gray-400">
          No archived patients found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleArchivedPatients.map((patient) => (
            <article key={patient.id} className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <Avatar name={patient.name} src={patient.avatar} className="w-10 h-10" />
                <div className="min-w-0 flex-1">
                  <Link to={`/patient/${patient.id}`} className="block hover:underline focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white rounded-sm">
                    <h3 className="font-bold text-black dark:text-white truncate">{patient.name}</h3>
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">ID: {patient.id}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Archived copy</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => handleRestore(patient.id)}>
                  Restore
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!patientToRestore}
        onClose={() => setPatientToRestore(null)}
        title="Restore Patient"
      >
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to restore this patient to the main list?
        </p>
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={() => setPatientToRestore(null)}>
            Cancel
          </Button>
          <Button
            onClick={confirmRestore}
            className="bg-green-500 hover:bg-green-600 text-white border-transparent"
          >
            Restore
          </Button>
        </div>
      </Modal>
    </div>
  );
}