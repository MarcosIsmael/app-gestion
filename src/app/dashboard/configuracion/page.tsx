'use client';

import { useEffect, useState } from 'react';

interface ConfigOptions {
  actualizarStock: boolean;
  actualizarPrecioCosto: boolean;
  actualizarPrecioVenta: boolean;
  gananciaPredeterminada: number;
}

const defaultConfig: ConfigOptions = {
  actualizarStock: true,
  actualizarPrecioCosto: true,
  actualizarPrecioVenta: false,
  gananciaPredeterminada: 20,
};

export default function SettingsPage() {
  const [config, setConfig] = useState<ConfigOptions>(defaultConfig);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiLoading, setApiLoading] = useState<boolean>(true); // Cargar configuración desde la API

  // Cargar configuración desde la API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        const configData: ConfigOptions = {
          actualizarStock: Boolean(data.find((item: any) => item.clave === 'actualizarStock' && item.valor_booleano)),
          actualizarPrecioCosto: Boolean(data.find((item: any) => item.clave === 'actualizarPrecioCosto' && item.valor_booleano)),
          actualizarPrecioVenta: Boolean(data.find((item: any) => item.clave === 'actualizarPrecioVenta' && item.valor_booleano)),
          gananciaPredeterminada: data.find((item: any) => item.clave === 'gananciaPredeterminada')?.valor_entero ?? 20,
        };
        setConfig(configData);
      } catch (error) {
        console.error('Error al cargar la configuración:', error);
      } finally {
        setApiLoading(false); // Termina de cargar la configuración
      }
    };

    fetchConfig();
  }, []);

  // Guardar configuración en la base de datos
  const saveConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert('Hubo un error al guardar la configuración.');
      }
    } catch (error) {
      alert('Error en la conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : Number(value),
    }));
  };

  // Si la API aún está cargando, mostrar un mensaje de carga
  if (apiLoading) {
    return <div>Loading configuration...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Configuraciones</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveConfig();
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <label>
            <input
              type="checkbox"
              name="actualizarStock"
              checked={config.actualizarStock}
              onChange={handleInputChange}
            />
            Actualizar automáticamente el stock
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>
            <input
              type="checkbox"
              name="actualizarPrecioCosto"
              checked={config.actualizarPrecioCosto}
              onChange={handleInputChange}
            />
            Recalcular automáticamente el precio de costo
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>
            <input
              type="checkbox"
              name="actualizarPrecioVenta"
              checked={config.actualizarPrecioVenta}
              onChange={handleInputChange}
            />
            Actualizar automáticamente el precio de venta
          </label>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>
            Porcentaje de margen por defecto:
            <input
              type="number"
              name="gananciaPredeterminada"
              value={config.gananciaPredeterminada}
              onChange={handleInputChange}
              style={{ marginLeft: '10px', width: '60px' }}
            />
            %
          </label>
        </div>

        <button
          type="submit"
          style={{ padding: '10px 20px', cursor: 'pointer' }}
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar Configuraciones'}
        </button>
      </form>
    </div>
  );
}
