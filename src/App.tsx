import { useEffect, useState } from 'react'
import { fetchPatients } from './services/api'
import type { Patient } from './types/patient'

function App() {
  const [patients, setPatients] = useState<Patient[]>([])

  useEffect(() => {
    fetchPatients().then(setPatients).catch(console.error)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Pacientes: {patients.length}</h1>
      <pre className="text-xs">{JSON.stringify(patients[0], null, 2)}</pre>
    </div>
  )
}

export default App