// ruta: frontend/src/pages/admin/QuoteProcessingPage.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// --- Tipos y Datos Simulados ---
type QuoteStatus = 'PENDIENTE' | 'PRESUPUESTADA' | 'RECHAZADA' | 'APROBADA';

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Quote {
  id: string;
  customer: Customer;
  serviceName: string;
  description: string;
  status: QuoteStatus;
  presupuestoFinal?: number;
  notasAdministrativas?: string;
  createdAt: string;
}

// Base de datos simulada de cotizaciones
const mockQuotes: Quote[] = [
  {
    id: 'q-001',
    customer: { id: 'c-1', name: 'Innovatec S.A.', email: 'contacto@innovatec.com' },
    serviceName: 'Mantenimiento Preventivo de Redes',
    description: 'Necesitamos una revisión completa de nuestra infraestructura de red en la oficina principal. Son 25 puntos de red, 3 switches y 1 router principal. La última revisión fue hace más de un año.',
    status: 'PENDIENTE',
    createdAt: '2023-10-26T10:00:00Z',
  },
  {
    id: 'q-002',
    customer: { id: 'c-2', name: 'María Robles', email: 'maria.r@email.com' },
    serviceName: 'Instalación Eléctrica Residencial',
    description: 'Solicito cotización para la instalación eléctrica de una casa nueva de 2 pisos, aproximadamente 150 m². Se requiere plano y certificación.',
    status: 'PENDIENTE',
    createdAt: '2023-10-25T15:30:00Z',
  },
];

// --- Simulación del Hook useApi ---
// En una aplicación real, este hook estaría en un archivo separado.
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = useCallback(async (url: string): Promise<any> => {
    setLoading(true);
    setError(null);
    console.log(`GET: ${url}`);
    const id = url.split('/').pop();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = mockQuotes.find(q => q.id === id);
        setLoading(false);
        if (data) {
          resolve(data);
        } else {
          setError('Recurso no encontrado');
          reject(new Error('Recurso no encontrado'));
        }
      }, 500);
    });
  }, []);

  const patch = useCallback(async (url: string, body: Partial<Quote>): Promise<any> => {
    setLoading(true);
    setError(null);
    console.log(`PATCH: ${url}`, body);
    const id = url.split('/').pop();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const quoteIndex = mockQuotes.findIndex(q => q.id === id);
        if (quoteIndex !== -1) {
          mockQuotes[quoteIndex] = { ...mockQuotes[quoteIndex], ...body };
          setLoading(false);
          resolve(mockQuotes[quoteIndex]);
        } else {
          setError('Recurso no encontrado para actualizar');
          setLoading(false);
          reject(new Error('Recurso no encontrado para actualizar'));
        }
      }, 500);
    });
  }, []);

  return { get, patch, loading, error };
};


// --- Componente Principal ---

const QuoteProcessingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { get, patch, loading, error: apiError } = useApi();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [finalBudget, setFinalBudget] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      get(`/quotations/${id}`)
        .then(data => {
          setQuote(data);
          setFinalBudget(data.presupuestoFinal?.toString() || '');
          setAdminNotes(data.notasAdministrativas || '');
        })
        .catch(console.error);
    }
  }, [id, get]);

  const handleUpdate = async (status: 'PRESUPUESTADA' | 'RECHAZADA') => {
    if (!id) return;

    let payload: Partial<Quote> = { status };

    if (status === 'PRESUPUESTADA') {
      if (!finalBudget || isNaN(parseFloat(finalBudget))) {
        setFormError('El presupuesto final es requerido y debe ser un número.');
        return;
      }
      payload = {
        ...payload,
        presupuestoFinal: parseFloat(finalBudget),
        notasAdministrativas: adminNotes,
      };
    }
    
    setFormError(null);
    try {
      const updatedQuote = await patch(`/quotations/${id}`, payload);
      setQuote(updatedQuote);
      // Opcional: mostrar un toast/notificación de éxito
      alert(`La cotización ha sido actualizada al estado: ${status}`);
    } catch (error) {
      console.error(error);
      alert('Hubo un error al actualizar la cotización.');
    }
  };
  
  const getStatusBadge = (status: QuoteStatus) => {
    const styles: { [key in QuoteStatus]: string } = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      PRESUPUESTADA: 'bg-blue-100 text-blue-800',
      APROBADA: 'bg-green-100 text-green-800',
      RECHAZADA: 'bg-red-100 text-red-800',
    };
    return `px-3 py-1 text-sm font-medium rounded-full ${styles[status]}`;
  };

  if (loading && !quote) return <div className="p-8">Cargando cotización...</div>;
  if (apiError) return <div className="p-8 text-red-500">Error: {apiError}</div>;
  if (!quote) return <div className="p-8">No se encontró la cotización.</div>;

  return (
    // Este componente debería ser renderizado dentro de tu AdminLayout
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Procesar Cotización</h1>
        <p className="text-gray-500 mt-1">ID de Solicitud: {quote.id}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna de Formulario y Acciones (ocupa 2/3) */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">Formulario de Procesamiento</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-6">
                <label htmlFor="finalBudget" className="block text-sm font-medium text-gray-700 mb-1">
                  Presupuesto Final (S/.)
                </label>
                <input
                  type="number"
                  id="finalBudget"
                  value={finalBudget}
                  onChange={(e) => setFinalBudget(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ej: 1500.00"
                  disabled={quote.status !== 'PENDIENTE'}
                />
              </div>
              <div>
                <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Administrativas (Opcional)
                </label>
                <textarea
                  id="adminNotes"
                  rows={4}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Anotaciones internas, detalles técnicos, etc."
                  disabled={quote.status !== 'PENDIENTE'}
                />
              </div>
              {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
            </form>
            
            {quote.status === 'PENDIENTE' && (
              <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t">
                <button
                  onClick={() => handleUpdate('RECHAZADA')}
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  Rechazar Solicitud
                </button>
                <button
                  onClick={() => handleUpdate('PRESUPUESTADA')}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Generando...' : 'Generar Presupuesto'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Columna de Datos (ocupa 1/3) */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Estado de la Solicitud</h3>
            <div className="flex justify-between items-center">
              <span>Estado Actual:</span>
              <span className={getStatusBadge(quote.status)}>{quote.status}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Datos del Cliente</h3>
            <dl className="space-y-2">
              <div className="flex justify-between"><dt className="font-medium text-gray-600">Nombre:</dt><dd className="text-gray-800">{quote.customer.name}</dd></div>
              <div className="flex justify-between"><dt className="font-medium text-gray-600">Email:</dt><dd className="text-gray-800">{quote.customer.email}</dd></div>
            </dl>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Solicitud Original</h3>
            <p className="text-gray-600 italic">"{quote.description}"</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuoteProcessingPage;