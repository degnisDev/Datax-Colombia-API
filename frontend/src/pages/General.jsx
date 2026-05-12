import React, { useState, useEffect } from 'react';
import './General.css';

export default function General() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Conectamos con tu API de FastAPI
        fetch('http://127.0.0.1:8000/data')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(setLoading(false));
            })
            .catch(err => console.error("Error cargando datos:", err));
    }, []);

    if (loading) return <div className="loading">Cargando datos maestros...</div>;

    return (
        <div className="general-page">
            {/* Reutilizamos el fondo de los presidentes pero con más desenfoque */}
            <div className="hero-background" style={{ filter: 'blur(8px) brightness(0.3)' }}></div>

            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h2 className="glow-text">DASHBOARD GENERAL</h2>
                    <p>Indicadores Consolidados de Colombia (1990 - 2025)</p>
                </header>

                {/* Grid de las 9 Tarjetas (KPIs) */}
                <div className="kpi-grid">
                    <div className="kpi-card yellow"><h3>PIB</h3><p>Crecimiento anual</p></div>
                    <div className="kpi-card blue"><h3>Presupuesto</h3><p>Gasto Total</p></div>
                    <div className="kpi-card yellow"><h3>Gasto Militar</h3><p>% del Presupuesto</p></div>

                    <div className="kpi-card blue"><h3>Educación</h3><p>% del Presupuesto</p></div>
                    <div className="kpi-card red"><h3>Inflación</h3><p>IPC Anual</p></div>
                    <div className="kpi-card red"><h3>Desempleo</h3><p>Tasa Nacional</p></div>

                    <div className="kpi-card yellow"><h3>Inv. Extranjera</h3><p>% del PIB</p></div>
                    <div className="kpi-card blue"><h3>Salario Mínimo</h3><p>COP Mensual</p></div>
                    <div className="kpi-card red"><h3>Conflicto</h3><p>Bajas en combate</p></div>
                </div>

                {/* Espacio para el gráfico que haremos en el siguiente paso */}
                <div className="main-chart-container glass-panel">
                    <p style={{ color: 'var(--text-muted)' }}>Selecciona un indicador para ver la gráfica histórica</p>
                </div>
            </div>
        </div>
    );
}
