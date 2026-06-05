import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    PieChart, Pie, Cell, ResponsiveContainer, XAxis, Tooltip
} from 'recharts';
import './Presidente.css';
import API_BASE_URL from '../config';

/* ════════════════════════════════════════════
   CONFIGURACIÓN
   ════════════════════════════════════════════ */

const PRESIDENTS = [
    { key: 'Petro', displayName: 'Gustavo Petro', period: '2022 – presente', csvName: 'Gustavo Petro', photo: '/presidents/Gustavo_Petro.jpg', color: '#B71C1C' },
    { key: 'Duque', displayName: 'Iván Duque', period: '2018 – 2022', csvName: 'Iván Duque', photo: '/presidents/Ivan_Duque.jpg', color: '#E65100' },
    { key: 'Santos_2', displayName: 'J.M. Santos II', period: '2014 – 2018', csvName: 'Juan Manuel Santos 2', photo: '/presidents/Juan_Santos_2.jpg', color: '#9CCC65' },
    { key: 'Santos_1', displayName: 'J.M. Santos I', period: '2010 – 2014', csvName: 'Juan Manuel Santos 1', photo: '/presidents/Juan_Santos_1.jpg', color: '#2E7D32' },
    { key: 'Uribe_2', displayName: 'Álvaro Uribe II', period: '2006 – 2010', csvName: 'Álvaro Uribe 2', photo: '/presidents/Alvaro_Uribe_2.jpg', color: '#42A5F5' },
    { key: 'Uribe_1', displayName: 'Álvaro Uribe I', period: '2002 – 2006', csvName: 'Álvaro Uribe 1', photo: '/presidents/Alvaro_Uribe_1.jpg', color: '#1565C0' },
    { key: 'Pastrana', displayName: 'Andrés Pastrana', period: '1998 – 2002', csvName: 'Andrés Pastrana', photo: '/presidents/Andres_Pastrana.jpg', color: '#00838F' },
    { key: 'Samper', displayName: 'Ernesto Samper', period: '1994 – 1998', csvName: 'Ernesto Samper', photo: '/presidents/Ernesto_Samper.jpg', color: '#7B1FA2' },
    { key: 'Gaviria', displayName: 'César Gaviria', period: '1990 – 1994', csvName: 'César Gaviria', photo: '/presidents/Cesar_Gaviria.webp', color: '#78909C' },
];

const KPI_CONFIG = [
    { key: 'Crecimiento_PIB_pct', label: 'PIB', unit: '%', icon: '', chartType: 'line', higherIsBetter: true },
    { key: 'Presupuesto_Total_COP', label: 'Presupuesto', unit: 'B', icon: '', chartType: 'bar', higherIsBetter: true },
    { key: 'Gasto_Militar_pct_Presupuesto', label: 'Gasto Militar', unit: '%', icon: '', chartType: 'donut', higherIsBetter: null },
    { key: 'Gasto_Educacion_pct_Presupuesto', label: 'Educación', unit: '%', icon: '', chartType: 'donut', higherIsBetter: true },
    { key: 'Inflacion_Anual_pct', label: 'Inflación', unit: '%', icon: '', chartType: 'line', higherIsBetter: false },
    { key: 'Desempleo_pct_Total', label: 'Desempleo', unit: '%', icon: '', chartType: 'line', higherIsBetter: false },
    { key: 'Inversion_Extranjera_pct_PIB', label: 'Inv. Extranjera', unit: '%', icon: '', chartType: 'line', higherIsBetter: true },
    { key: 'Salario_Minimo_COP', label: 'Salario Mínimo', unit: 'COP', icon: '', chartType: 'bar', higherIsBetter: true },
    { key: 'Muertes_Conflicto', label: 'Conflicto', unit: '', icon: '', chartType: 'area', higherIsBetter: false },
];

/* ════════════════════════════════════════════
   UTILIDADES
   ════════════════════════════════════════════ */

function fmt(value, unit, key) {
    if (value === null || value === undefined || isNaN(value)) return '—';
    if (unit === 'COP') return '$' + new Intl.NumberFormat('es-CO').format(Math.round(value));
    if (unit === 'B') return value.toFixed(1) + ' B';
    if (key === 'Muertes_Conflicto') return Math.round(value).toLocaleString();
    return value.toFixed(1) + '%';
}

function fmtDelta(delta, unit) {
    if (delta === null || isNaN(delta)) return '';
    const sign = delta >= 0 ? '+' : '';
    if (unit === 'COP') return sign + new Intl.NumberFormat('es-CO').format(Math.round(delta));
    if (unit === 'B') return sign + delta.toFixed(1);
    return sign + delta.toFixed(1);
}

function getDeltaClass(delta, higherIsBetter) {
    if (delta === null || isNaN(delta) || higherIsBetter === null) return 'delta-neutral';
    const isGood = higherIsBetter ? delta > 0 : delta < 0;
    return isGood ? 'delta-good' : 'delta-bad';
}

/* ════════════════════════════════════════════
   SUB-COMPONENTES
   ════════════════════════════════════════════ */

// Mini tooltip para gráficas
function MiniTooltip({ active, payload, unit, kpiKey }) {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
        <div style={{
            background: 'rgba(10,14,26,0.95)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '8px 12px', fontSize: '0.78rem',
        }}>
            <span style={{ color: '#888' }}>{d.year}: </span>
            <span style={{ color: '#fff', fontWeight: 700 }}>{fmt(d.value, unit, kpiKey)}</span>
        </div>
    );
}

// Gráfica sparkline (línea)
function SparkLine({ data, color, unit, kpiKey }) {
    return (
        <ResponsiveContainer width="100%" height={90}>
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <XAxis dataKey="year" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<MiniTooltip unit={unit} kpiKey={kpiKey} />} />
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5}
                    dot={{ r: 4, fill: color, stroke: '#0A0E1A', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: color }} />
            </LineChart>
        </ResponsiveContainer>
    );
}

// Gráfica mini barras
function SparkBars({ data, color, unit, kpiKey }) {
    return (
        <ResponsiveContainer width="100%" height={90}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <XAxis dataKey="year" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<MiniTooltip unit={unit} kpiKey={kpiKey} />} />
                <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
        </ResponsiveContainer>
    );
}

// Gráfica de área
function SparkArea({ data, color, unit, kpiKey }) {
    return (
        <ResponsiveContainer width="100%" height={90}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <XAxis dataKey="year" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<MiniTooltip unit={unit} kpiKey={kpiKey} />} />
                <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2}
                    fill={color} fillOpacity={0.15} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

// Gráfica donut
function SparkDonut({ avgValue, color }) {
    const donutData = [
        { name: 'value', value: avgValue },
        { name: 'rest', value: Math.max(0, 100 - avgValue) },
    ];
    return (
        <div className="donut-container">
            <ResponsiveContainer width={90} height={90}>
                <PieChart>
                    <Pie data={donutData} innerRadius={28} outerRadius={40} dataKey="value"
                        startAngle={90} endAngle={-270} stroke="none">
                        <Cell fill={color} />
                        <Cell fill="rgba(255,255,255,0.06)" />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="donut-avg">
                <div className="donut-avg-value" style={{ color }}>{avgValue.toFixed(1)}%</div>
                <div className="donut-avg-label">Promedio</div>
            </div>
        </div>
    );
}

// Tarjeta de indicador completa
function IndicadorCard({ kpi, yearData, presColor }) {
    const avg = yearData.reduce((s, d) => s + d.value, 0) / yearData.length;

    return (
        <div className="indicador-card">
            <div className="indicador-header">
                <span className="indicador-icon">{kpi.icon}</span>
                <span className="indicador-label">{kpi.label}</span>
            </div>

            {/* Gráfica según tipo */}
            <div className="indicador-chart">
                {kpi.chartType === 'line' && <SparkLine data={yearData} color={presColor} unit={kpi.unit} kpiKey={kpi.key} />}
                {kpi.chartType === 'bar' && <SparkBars data={yearData} color={presColor} unit={kpi.unit} kpiKey={kpi.key} />}
                {kpi.chartType === 'area' && <SparkArea data={yearData} color={presColor} unit={kpi.unit} kpiKey={kpi.key} />}
                {kpi.chartType === 'donut' && <SparkDonut avgValue={avg} color={presColor} />}
            </div>

            {/* Tabla año por año con delta */}
            <div className="year-table">
                {yearData.map(d => (
                    <div className="year-row" key={d.year}>
                        <span className="year-label">{d.year}</span>
                        <span className="year-value">{fmt(d.value, kpi.unit, kpi.key)}</span>
                        <span className={`year-delta ${getDeltaClass(d.delta, kpi.higherIsBetter)}`}>
                            {d.delta !== null ? fmtDelta(d.delta, kpi.unit) : '—'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════ */

export default function Presidente() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedKey, setSelectedKey] = useState(null);

    // Fetch data
    useEffect(() => {
        fetch(`${API_BASE_URL}/data`)
            .then(res => res.json())
            .then(json => { setData(json); setLoading(false); })
            .catch(() => { setError(true); setLoading(false); });
    }, []);

    // Presidente seleccionado (objeto completo)
    const selectedPres = PRESIDENTS.find(p => p.key === selectedKey) || null;

    // Datos filtrados del presidente seleccionado
    const presRows = selectedPres
        ? data.filter(d => d.Presidente === selectedPres.csvName).sort((a, b) => a.anio - b.anio)
        : [];

    // Construir datos año por año para un KPI (con delta vs año anterior)
    const buildYearData = (kpiKey) => {
        return presRows.map(row => {
            const value = row[kpiKey] || 0;
            const prevRow = data.find(d => d.anio === row.anio - 1);
            const prevValue = prevRow ? prevRow[kpiKey] : null;
            const delta = (prevValue !== null && prevValue !== 0) ? value - prevValue : null;
            return { year: row.anio, value, delta };
        });
    };

    // Toggle selección
    const handleSelect = (key) => {
        setSelectedKey(selectedKey === key ? null : key);
    };

    // ---- Loading / Error ----
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

    // Color accent CSS variable
    const accentStyle = selectedPres
        ? { '--card-accent': selectedPres.color, '--card-glow': selectedPres.color + '30' }
        : {};

    return (
        <div className="presidente-page">
            {/* Fondo difuminado */}
            <div className="hero-background general-bg"></div>

            <div className="presidente-container">
                {/* Header */}
                <header className="dashboard-header presidente-header">
                    <span className="dashboard-badge">1990 — 2025</span>
                    <h1 className="glow-text">GESTIÓN POR PRESIDENTE</h1>
                    <p className="dashboard-subtitle">
                        {selectedPres
                            ? `Indicadores del gobierno de ${selectedPres.displayName}`
                            : 'Selecciona un presidente para explorar sus indicadores'
                        }
                    </p>
                </header>

                {/* Grid de Presidentes (siempre visible) */}
                <div className={`president-grid ${selectedKey ? 'has-active' : ''}`}>
                    {selectedKey && (
                        <div className="mobile-show-all-wrapper">
                            <button className="mobile-show-all-btn" onClick={() => setSelectedKey(null)}>
                                👁 Mostrar todos
                            </button>
                        </div>
                    )}
                    {PRESIDENTS.map(pres => {
                        const isSelected = selectedKey === pres.key;
                        const isDimmed = selectedKey && !isSelected;
                        return (
                            <div
                                key={pres.key}
                                className={`president-card ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''}`}
                                style={{ '--card-accent': pres.color, '--card-glow': pres.color + '25' }}
                                onClick={() => handleSelect(pres.key)}
                            >
                                <img
                                    className="president-photo"
                                    src={pres.photo}
                                    alt={pres.displayName}
                                />
                                <h3 className="president-name">{pres.displayName}</h3>
                                <p className="president-period">{pres.period}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Panel de Indicadores (solo si hay selección) */}
                {selectedPres ? (
                    <div style={accentStyle}>
                        {/* Hero Banner */}
                        <div className="president-hero" style={{
                            '--card-accent': selectedPres.color,
                            '--card-glow': selectedPres.color + '20'
                        }}>
                            <img className="hero-photo" src={selectedPres.photo} alt={selectedPres.displayName} />
                            <div className="hero-info">
                                <h2 className="hero-name">{selectedPres.displayName}</h2>
                                <p className="hero-role">Presidente de Colombia</p>
                                <p className="hero-period" style={{ color: selectedPres.color }}>
                                    {selectedPres.period} · {presRows.length} años registrados
                                </p>
                            </div>
                        </div>

                        {/* Grid 3×3 de Indicadores */}
                        <div className="indicador-grid">
                            {KPI_CONFIG.map(kpi => (
                                <IndicadorCard
                                    key={kpi.key}
                                    kpi={kpi}
                                    yearData={buildYearData(kpi.key)}
                                    presColor={selectedPres.color}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="empty-state-wrapper" style={{ marginTop: '100px' }}>
                        <div className="pulse-ring"></div>
                        <h2 className="empty-state-title" style={{ fontSize: '3.5rem', letterSpacing: '8px' }}>CONOCE TU HISTORIA</h2>
                        <p className="empty-state-text" style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                            Selecciona un mandatario arriba para desglosar los indicadores de su gestión
                        </p>
                    </div>
                )}
            </div>

            {/* Marquee Ticker al final */}
            <div className="ticker-container" style={{ position: 'relative', marginTop: '120px', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="ticker-track">
                    {[...aspectos_ticker, ...aspectos_ticker].map((asp, idx) => (
                        <div key={idx} className="ticker-item" style={{ color: asp.color }}>
                            {asp.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const aspectos_ticker = [
    { name: "PIB", color: "var(--colombia-yellow)" },
    { name: "Inflación", color: "var(--colombia-blue)" },
    { name: "Presupuesto", color: "var(--colombia-red)" },
    { name: "Gasto Militar", color: "var(--colombia-yellow)" },
    { name: "Educación", color: "var(--colombia-blue)" },
    { name: "Desempleo", color: "var(--colombia-red)" },
    { name: "Inv. Extranjera", color: "var(--colombia-yellow)" },
    { name: "Salario Mínimo", color: "var(--colombia-blue)" },
    { name: "Conflicto", color: "var(--colombia-red)" }
];

