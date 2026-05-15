import React, { useState, useEffect } from 'react';
import './General.css';
import PresidentChart from '../components/PresidentChart';
import API_BASE_URL from '../config';


// Configuración de los 9 indicadores KPI
const KPI_CONFIG = [
    { key: 'Crecimiento_PIB_pct', label: 'PIB', unit: '%', color: 'yellow', img: '/kpis/pib.png', desc: 'Crecimiento anual' },
    { key: 'Presupuesto_Total_COP', label: 'Presupuesto', unit: 'B', color: 'blue', img: '/kpis/presupuesto.png', desc: 'Billones COP' },
    { key: 'Gasto_Militar_pct_Presupuesto', label: 'Gasto Militar', unit: '%', color: 'red', img: '/kpis/gasto_militar.png', desc: 'Del presupuesto' },
    { key: 'Gasto_Educacion_pct_Presupuesto', label: 'Educación', unit: '%', color: 'blue', img: '/kpis/educacion.png', desc: 'Del presupuesto' },
    { key: 'Inflacion_Anual_pct', label: 'Inflación', unit: '%', color: 'red', img: '/kpis/inflacion.png', desc: 'IPC anual' },
    { key: 'Desempleo_pct_Total', label: 'Desempleo', unit: '%', color: 'red', img: '/kpis/desempleo.png', desc: 'Tasa nacional' },
    { key: 'Inversion_Extranjera_pct_PIB', label: 'Inv. Extranjera', unit: '%', color: 'yellow', img: '/kpis/inversion.png', desc: '% del PIB' },
    { key: 'Salario_Minimo_COP', label: 'Salario Mínimo', unit: 'COP', color: 'blue', img: '/kpis/salario.png', desc: 'Mensual' },
    { key: 'Muertes_Conflicto', label: 'Conflicto', unit: '', color: 'red', img: '/kpis/conflicto.png', desc: 'Bajas en combate' },
];

// Calcula el promedio de un campo en el dataset
function avg(data, key) {
    const valid = data.filter(d => d[key] && d[key] !== 0);
    if (!valid.length) return 0;
    return valid.reduce((sum, d) => sum + d[key], 0) / valid.length;
}

// Formatea el valor según la unidad
function fmt(value, unit, key) {
    if (unit === 'COP') return new Intl.NumberFormat('es-CO').format(Math.round(value));
    if (unit === 'B') return value.toFixed(1);
    if (key === 'Muertes_Conflicto') return Math.round(value).toLocaleString();
    return value.toFixed(1);
}

export default function General() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeKpi, setActiveKpi] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/data`)
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Cargando datos de Colombia...</p>
        </div>
    );

    if (error) return (
        <div className="loading-screen">
            <p style={{ color: 'var(--colombia-red)' }}>No se pudo conectar con la API.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Asegúrate de que el backend FastAPI esté corriendo en el puerto 8000.</p>
        </div>
    );

    return (
        <div className="general-page">
            {/* Fondo difuminado reutilizando el hero */}
            <div className="hero-background general-bg"></div>

            <div className="dashboard-container">
                {/* Header */}
                <header className="dashboard-header">
                    <span className="dashboard-badge">1990 — 2025</span>
                    <h1 className="glow-text">DASHBOARD GENERAL</h1>
                    <p className="dashboard-subtitle">Indicadores macroeconómicos consolidados · {data.length} años de historia</p>
                </header>

                {/* Grid de 9 KPI Cards con datos reales */}
                <div className="kpi-grid">
                    {KPI_CONFIG.map(kpi => {
                        const value = avg(data, kpi.key);
                        const isActive = activeKpi === kpi.key;
                        return (
                            <div
                                key={kpi.key}
                                className={`kpi-card kpi-${kpi.color} ${isActive ? 'kpi-active' : ''}`}
                                onClick={() => setActiveKpi(isActive ? null : kpi.key)}
                                style={{ 
                                    backgroundImage: `linear-gradient(rgba(10,14,26,0.85), rgba(10,14,26,0.85)), url(${kpi.img})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <h3 className="kpi-label">{kpi.label}</h3>
                                <div className="kpi-value">
                                    {fmt(value, kpi.unit, kpi.key)}
                                    <span className="kpi-unit">{kpi.unit}</span>
                                </div>
                                <p className="kpi-desc">{kpi.desc} · promedio histórico</p>
                            </div>
                        );
                    })}
                </div>

                {/* Panel del gráfico */}
                <div className="main-chart-container glass-panel" style={!activeKpi ? {
                    backgroundImage: `linear-gradient(rgba(10,14,26,0.7), rgba(10,14,26,0.7)), url('/casa_narino.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid rgba(255,255,255,0.1)'
                } : {}}>
                    {activeKpi ? (
                        <PresidentChart
                            indicador={activeKpi}
                            indicadorLabel={KPI_CONFIG.find(k => k.key === activeKpi)?.label}
                        />
                    ) : (
                        <div className="empty-state-wrapper">
                            <div className="pulse-ring"></div>
                            <h2 className="empty-state-title">EXPLORA LOS DATOS</h2>
                            <p className="empty-state-text">
                                Selecciona un indicador en las tarjetas superiores para visualizar la evolución histórica de Colombia
                            </p>
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
}
