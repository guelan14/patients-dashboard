import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button/Button';
import { Avatar } from '../components/ui/Avatar/Avatar';
import { fetchPatientById } from '../services/api';
import type { Patient } from '../types/patient';

export function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (isMounted) setError("No se pudo cargar la información del paciente.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    loadPatient();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="py-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="py-6">
        <Link to="/">
          <Button variant="outline" className="mb-6">&larr; Volver al Dashboard</Button>
        </Link>
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-100 dark:border-red-900/50">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || "Paciente no encontrado"}</p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(patient.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link to="/">
        <Button variant="outline" className="mb-6 group hover:border-black dark:hover:border-white transition-colors">
          <span className="inline-block transform group-hover:-translate-x-1 transition-transform">&larr;</span> Volver al Dashboard
        </Button>
      </Link>
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8 md:p-12 shadow-sm overflow-hidden relative">
        {/* Background gradient decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gray-100 to-transparent dark:from-slate-800 dark:to-transparent rounded-bl-full opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="shrink-0 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 dark:from-slate-700 dark:to-slate-800 rounded-full blur-md opacity-70" />
            <div className="relative transform hover:scale-105 transition-transform duration-300">
              {/* @ts-ignore */}
              <Avatar name={patient.name} src={patient.avatar} size="lg" className="w-32 h-32 text-4xl border-4 border-white dark:border-slate-900 shadow-xl" />
            </div>
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white leading-tight">
                  {patient.name}
                </h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                  ID: {patient.id.substring(0, 8)}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Registrado el {formattedDate}
              </p>
            </div>

            {patient.description && (
              <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50">
                <h3 className="text-sm uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-2">Acerca del Paciente</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {patient.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patient.website && (
                <div className="bg-gray-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-1">Sitio Web</h3>
                  <a 
                    href={patient.website.startsWith('http') ? patient.website : `https://${patient.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-black dark:text-white font-medium hover:underline flex items-center gap-2"
                  >
                    {patient.website}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
