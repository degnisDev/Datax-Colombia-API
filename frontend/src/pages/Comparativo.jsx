import React, { useState, useEffect, useRef } from 'react';
import {
    LineChart, Line, BarChart, Bar,
    ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid
} from 'recharts';
import './Comparativo.css';
import API_BASE_URL from '../config';

/* ════════════════════════════════════════════
   CONFIGURACIÓN
   ════════════════════════════════════════════ */

const PRESIDENTS = [
    { key: 'Gaviria', displayName: 'César Gaviria', period: '1990–1994', csvName: 'César Gaviria', photo: '/presidents/Cesar_Gaviria.webp', color: '#78909C' },
    { key: 'Samper', displayName: 'Ernesto Samper', period: '1994–1998', csvName: 'Ernesto Samper', photo: '/presidents/Ernesto_Samper.jpg', color: '#7B1FA2' },
    { key: 'Pastrana', displayName: 'Andrés Pastrana', period: '1998–2002', csvName: 'Andrés Pastrana', photo: '/presidents/Andres_Pastrana.jpg', color: '#00838F' },
    { key: 'Uribe_1', displayName: 'Álvaro Uribe I', period: '2002–2006', csvName: 'Álvaro Uribe 1', photo: '/presidents/Alvaro_Uribe_1.jpg', color: '#1565C0' },
    { key: 'Uribe_2', displayName: 'Álvaro Uribe II', period: '2006–2010', csvName: 'Álvaro Uribe 2', photo: '/presidents/Alvaro_Uribe_2.jpg', color: '#42A5F5' },
    { key: 'Santos_1', displayName: 'J.M. Santos I', period: '2010–2014', csvName: 'Juan Manuel Santos 1', photo: '/presidents/Juan_Santos_1.jpg', color: '#2E7D32' },
    { key: 'Santos_2', displayName: 'J.M. Santos II', period: '2014–2018', csvName: 'Juan Manuel Santos 2', photo: '/presidents/Juan_Santos_2.jpg', color: '#9CCC65' },
    { key: 'Duque', displayName: 'Iván Duque', period: '2018–2022', csvName: 'Iván Duque', photo: '/presidents/Ivan_Duque.jpg', color: '#E65100' },
    { key: 'Petro', displayName: 'Gustavo Petro', period: '2022–pres.', csvName: 'Gustavo Petro', photo: '/presidents/Gustavo_Petro.jpg', color: '#B71C1C' },
];

const KPI_CONFIG = [
    { key: 'Crecimiento_PIB_pct', label: 'PIB', unit: '%', icon: '', chartType: 'line', higherIsBetter: true },
    { key: 'Presupuesto_Total_COP', label: 'Presupuesto', unit: 'B', icon: '', chartType: 'bar', higherIsBetter: true },
    { key: 'Gasto_Militar_pct_Presupuesto', label: 'Gasto Militar', unit: '%', icon: '', chartType: 'bar', higherIsBetter: null },
    { key: 'Gasto_Educacion_pct_Presupuesto', label: 'Educación', unit: '%', icon: '', chartType: 'bar', higherIsBetter: true },
    { key: 'Inflacion_Anual_pct', label: 'Inflación', unit: '%', icon: '', chartType: 'line', higherIsBetter: false },
    { key: 'Desempleo_pct_Total', label: 'Desempleo', unit: '%', icon: '', chartType: 'line', higherIsBetter: false },
    { key: 'Inversion_Extranjera_pct_PIB', label: 'Inv. Extranjera', unit: '%', icon: '', chartType: 'line', higherIsBetter: true },
    { key: 'Salario_Minimo_COP', label: 'Salario Mínimo', unit: 'COP', icon: '', chartType: 'bar', higherIsBetter: true },
    { key: 'Muertes_Conflicto', label: 'Conflicto', unit: '', icon: '', chartType: 'line', higherIsBetter: false },
];

/* ════════════════════════════════════════════
   UTILIDADES
   ════════════════════════════════════════════ */

function fmt(value, unit, key) {
    if (value === null || value === undefined || isNaN(value)) return '—';
    if (unit === 'COP') return '$' + new Intl.NumberFormat('es-CO').format(Math.round(value));
    if (unit === 'B') return value.toFixed(1) + ' B';
    if (key === 'Muertes_Conflicto') return Math.round(value).toLocaleString();
    return value.toFixed(2) + '%';
}

function getWinner(avgA, avgB, higherIsBetter) {
    if (higherIsBetter === null) return null;
    if (avgA === avgB) return 'tie';
    return (higherIsBetter ? avgA > avgB : avgA < avgB) ? 'A' : 'B';
}

/* ════════════════════════════════════════════
   TOOLTIP PERSONALIZADO
   ════════════════════════════════════════════ */

function CompTooltip({ active, payload, label, unit, kpiKey }) {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
        <div className="comp-tooltip">
            <div className="comp-tooltip-year">{label}</div>
            {payload.map((p, i) => {
                const actualYear = i === 0 ? d?.yearA : d?.yearB;
                return (
                    <div key={i} className="comp-tooltip-row">
                        <span className="comp-tooltip-dot" style={{ background: p.color }} />
                        <span className="comp-tooltip-name">
                            {p.name}{actualYear ? ` (${actualYear})` : ''}:
                        </span>
                        <span className="comp-tooltip-val">{fmt(p.value, unit, kpiKey)}</span>
                    </div>
                );
            })}
        </div>
    );
}

/* ════════════════════════════════════════════
   TARJETA DE COMPARACIÓN
   ════════════════════════════════════════════ */

function CompCard({ kpi, presA, presB, rowsA, rowsB }) {
    // Construir datos por POSICIÓN en el mandato (Año 1, Año 2, ...)
    const maxLen = Math.max(rowsA.length, rowsB.length);
    const chartData = Array.from({ length: maxLen }, (_, i) => ({
        label: `Año ${i + 1}`,
        yearA: rowsA[i]?.anio ?? null,
        yearB: rowsB[i]?.anio ?? null,
        [presA.displayName]: rowsA[i]?.[kpi.key] ?? null,
        [presB.displayName]: rowsB[i]?.[kpi.key] ?? null,
    }));

    // Eje X por posición

    // Estadísticas resumen
    const valsA = rowsA.map(r => r[kpi.key]).filter(v => v != null && !isNaN(v));
    const valsB = rowsB.map(r => r[kpi.key]).filter(v => v != null && !isNaN(v));
    const avgA = valsA.length ? valsA.reduce((s, v) => s + v, 0) / valsA.length : 0;
    const avgB = valsB.length ? valsB.reduce((s, v) => s + v, 0) / valsB.length : 0;

    const bestA = kpi.higherIsBetter !== false ? Math.max(...valsA) : Math.min(...valsA);
    const bestB = kpi.higherIsBetter !== false ? Math.max(...valsB) : Math.min(...valsB);
    const worstA = kpi.higherIsBetter !== false ? Math.min(...valsA) : Math.max(...valsA);
    const worstB = kpi.higherIsBetter !== false ? Math.min(...valsB) : Math.max(...valsB);

    const bestYearA = rowsA.find(r => r[kpi.key] === bestA)?.anio;
    const bestYearB = rowsB.find(r => r[kpi.key] === bestB)?.anio;
    const worstYearA = rowsA.find(r => r[kpi.key] === worstA)?.anio;
    const worstYearB = rowsB.find(r => r[kpi.key] === worstB)?.anio;

    const winner = getWinner(avgA, avgB, kpi.higherIsBetter);

    const sharedChartProps = {
        data: chartData,
        margin: { top: 10, right: 20, left: 0, bottom: 0 }
    };

    const tooltipEl = (
        <Tooltip content={<CompTooltip unit={kpi.unit} kpiKey={kpi.key} />} />
    );

    const xAxisEl = (
        <XAxis
            dataKey="label"
            tick={{ fill: '#556', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
        />
    );

    const yAxisEl = (
        <YAxis
            tick={{ fill: '#556', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={45}
            tickFormatter={v => kpi.unit === 'COP'
                ? (v / 1000000).toFixed(0) + 'M'
                : kpi.unit === 'B' ? v.toFixed(0) + 'B'
                    : v.toFixed(1)}
        />
    );

    return (
        <div className="comp-card">
            <div className="comp-card-header">
                <span className="comp-card-label">{kpi.label}</span>
                {winner && winner !== 'tie' && (
                    <span
                        className="comp-card-winner-badge"
                        style={{ background: (winner === 'A' ? presA.color : presB.color) + '25', color: winner === 'A' ? presA.color : presB.color, border: `1px solid ${winner === 'A' ? presA.color : presB.color}40` }}
                    >
                        {kpi.key === 'Presupuesto_Total_COP' ? 'Mayor' : 'Mejor'}: {winner === 'A' ? presA.displayName.split(' ')[0] : presB.displayName.split(' ')[0]}
                    </span>
                )}
            </div>

            {/* Gráfica */}
            <div className="comp-chart-area">
                <ResponsiveContainer width="100%" height={200}>
                    {kpi.chartType === 'line' ? (
                        <LineChart {...sharedChartProps}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            {xAxisEl}{yAxisEl}{tooltipEl}
                            <Line type="monotone" dataKey={presA.displayName} stroke={presA.color} strokeWidth={2.5}
                                dot={{ r: 4, fill: presA.color, stroke: '#0A0E1A', strokeWidth: 2 }}
                                activeDot={{ r: 6 }} connectNulls={false} />
                            <Line type="monotone" dataKey={presB.displayName} stroke={presB.color} strokeWidth={2.5}
                                strokeDasharray="6 3"
                                dot={{ r: 4, fill: presB.color, stroke: '#0A0E1A', strokeWidth: 2 }}
                                activeDot={{ r: 6 }} connectNulls={false} />
                        </LineChart>
                    ) : (
                        <BarChart {...sharedChartProps} barCategoryGap="30%">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            {xAxisEl}{yAxisEl}{tooltipEl}
                            <Bar dataKey={presA.displayName} fill={presA.color} radius={[4, 4, 0, 0]} opacity={0.85} />
                            <Bar dataKey={presB.displayName} fill={presB.color} radius={[4, 4, 0, 0]} opacity={0.85} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Leyenda de colores */}
            <div className="comp-legend">
                <span className="comp-legend-item">
                    <span className="comp-legend-dot" style={{ background: presA.color }} />
                    {presA.displayName}
                    {kpi.chartType === 'line' && <span className="comp-legend-line" style={{ background: presA.color }} />}
                </span>
                <span className="comp-legend-item">
                    <span className="comp-legend-dot" style={{ background: presB.color }} />
                    {presB.displayName}
                    {kpi.chartType === 'line' && <span className="comp-legend-dashed" style={{ borderTopColor: presB.color }} />}
                </span>
            </div>

            {/* Tabla resumen */}
            <div className="comp-stats-grid">
                <div className="comp-stats-col" style={{ '--col-color': presA.color }}>
                    <div className="comp-stats-header" style={{ color: presA.color }}>
                        <img src={presA.photo} alt={presA.displayName} className="comp-stats-avatar" />
                        {presA.displayName.split(' ').slice(-1)[0]}
                    </div>
                    <div className="comp-stat-row">
                        <span className="comp-stat-lbl">Promedio</span>
                        <span className="comp-stat-val" style={winner === 'A' ? { color: presA.color, fontWeight: 900 } : {}}>{fmt(avgA, kpi.unit, kpi.key)}</span>
                    </div>
                    <div className="comp-stat-row">
                        <span className="comp-stat-lbl">Mejor año</span>
                        <span className="comp-stat-val">{fmt(bestA, kpi.unit, kpi.key)} <em>({bestYearA})</em></span>
                    </div>
                    <div className="comp-stat-row">
                        <span className="comp-stat-lbl">Peor año</span>
                        <span className="comp-stat-val">{fmt(worstA, kpi.unit, kpi.key)} <em>({worstYearA})</em></span>
                    </div>
                </div>

                <div className="comp-stats-divider" />

                <div className="comp-stats-col" style={{ '--col-color': presB.color }}>
                    <div className="comp-stats-header" style={{ color: presB.color }}>
                        <img src={presB.photo} alt={presB.displayName} className="comp-stats-avatar" />
                        {presB.displayName.split(' ').slice(-1)[0]}
                    </div>
                    <div className="comp-stat-row">
                        <span className="comp-stat-lbl">Promedio</span>
                        <span className="comp-stat-val" style={winner === 'B' ? { color: presB.color, fontWeight: 900 } : {}}>{fmt(avgB, kpi.unit, kpi.key)}</span>
                    </div>
                    <div className="comp-stat-row">
                        <span className="comp-stat-lbl">Mejor año</span>
                        <span className="comp-stat-val">{fmt(bestB, kpi.unit, kpi.key)} <em>({bestYearB})</em></span>
                    </div>
                    <div className="comp-stat-row">
                        <span className="comp-stat-lbl">Peor año</span>
                        <span className="comp-stat-val">{fmt(worstB, kpi.unit, kpi.key)} <em>({worstYearB})</em></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════ */

export default function Comparativo() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]); // máx 2
    const [activeKpis, setActiveKpis] = useState([]);
    const [vsBannerVisible, setVsBannerVisible] = useState(false);
    const [kpiSectionVisible, setKpiSectionVisible] = useState(false);
    const bannerRef = useRef(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/data`)
            .then(res => res.json())
            .then(json => { setData(json); setLoading(false); })
            .catch(() => { setError(true); setLoading(false); });
    }, []);

    // Controlar animaciones al completar la selección de 2 presidentes
    useEffect(() => {
        if (selectedKeys.length === 2) {
            setVsBannerVisible(false);
            setTimeout(() => setVsBannerVisible(true), 50);
            setTimeout(() => setKpiSectionVisible(true), 600);
        } else {
            setVsBannerVisible(false);
            setKpiSectionVisible(false);
            setActiveKpis([]);
        }
    }, [selectedKeys]);

    const handlePresidentClick = (key) => {
        if (selectedKeys.includes(key)) {
            setSelectedKeys(prev => prev.filter(k => k !== key));
        } else {
            if (selectedKeys.length < 2) {
                setSelectedKeys(prev => [...prev, key]);
            }
            // si ya hay 2, no hacemos nada (el usuario debe deseleccionar uno primero)
        }
    };

    const toggleKpi = (key) => {
        setActiveKpis(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const selectAllKpis = () => {
        setActiveKpis(activeKpis.length === KPI_CONFIG.length ? [] : KPI_CONFIG.map(k => k.key));
    };

    const presA = PRESIDENTS.find(p => p.key === selectedKeys[0]);
    const presB = PRESIDENTS.find(p => p.key === selectedKeys[1]);

    const rowsA = presA ? data.filter(d => d.Presidente === presA.csvName).sort((a, b) => a.anio - b.anio) : [];
    const rowsB = presB ? data.filter(d => d.Presidente === presB.csvName).sort((a, b) => a.anio - b.anio) : [];

    const activeKpiConfigs = KPI_CONFIG.filter(k => activeKpis.includes(k.key));

    // ---- Loading / Error ----
    if (loading) return (
        <div className="loading-screen">
            <div className="loading-spinner" />
            <p>Cargando datos de Colombia...</p>
        </div>
    );

    if (error) return (
        <div className="loading-screen">
            <p style={{ color: 'var(--colombia-red)' }}>⚠️ No se pudo conectar con la API.</p>
        </div>
    );

    const hasTwoSelected = selectedKeys.length === 2;

    return (
        <div className="comparativo-page">
            <div className="hero-background general-bg" />

            <div className="comparativo-container">

                {/* ── HEADER ── */}
                <header className="dashboard-header comparativo-header">
                    <span className="dashboard-badge">1990 — 2025</span>
                    <h1 className="glow-text">COMPARATIVO PRESIDENCIAL</h1>
                    <p className="dashboard-subtitle">
                        {!hasTwoSelected
                            ? `Selecciona 2 presidentes · ${selectedKeys.length}/2 seleccionados`
                            : `${presA.displayName} vs ${presB.displayName}`
                        }
                    </p>
                </header>

                {/* ── GRID HORIZONTAL DE PRESIDENTES ── */}
                <div className="pres-selector-wrapper">
                    <div className="scroll-arrow scroll-left">‹</div>
                    <div className="pres-selector-row">
                        {PRESIDENTS.map((pres, idx) => {
                            const isSelected = selectedKeys.includes(pres.key);
                            const selIndex = selectedKeys.indexOf(pres.key); // 0 o 1
                            const isDimmed = hasTwoSelected && !isSelected;
                            const isBlocked = !isSelected && selectedKeys.length === 2;
                            return (
                                <div
                                    key={pres.key}
                                    className={`pres-mini-card ${isSelected ? 'pres-selected' : ''} ${isDimmed ? 'pres-dimmed' : ''} ${isBlocked ? 'pres-blocked' : ''}`}
                                    style={{ '--card-color': pres.color, '--card-glow': pres.color + '30' }}
                                    onClick={() => handlePresidentClick(pres.key)}
                                    title={isBlocked ? 'Deselecciona un presidente primero' : pres.displayName}
                                >
                                    {/* Badge 1/2 */}
                                    {isSelected && (
                                        <span className="pres-badge" style={{ background: pres.color }}>
                                            {selIndex === 0 ? '1' : '2'}
                                        </span>
                                    )}
                                    <img src={pres.photo} alt={pres.displayName} className="pres-mini-photo" />
                                    <span className="pres-mini-name">{pres.displayName}</span>
                                    <span className="pres-mini-period">{pres.period}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="scroll-arrow scroll-right">›</div>
                </div>

                {/* ── HERO ARENA — Empty State Cinematográfico ── */}
                {!hasTwoSelected && (
                    <div className="hero-arena-container">
                        <img
                            src="/presidents/data_arena_vf.png"
                            alt="Data Arena — Comparativo Presidencial"
                            className="hero-arena-img"
                        />
                        <div className="arena-vignette" />
                        <div className="arena-scanlines" />
                        <div className="arena-overlay">
                            <span className="arena-title-top">DATAX COLOMBIA</span>
                            <span className="arena-title-main">CHOOSE YOUR FIGHTERS</span>
                            <span className="arena-title-sub">Selecciona 2 presidentes arriba para iniciar el duelo</span>
                        </div>
                    </div>
                )}

                {/* Mensaje de ayuda si intentan un 3ro */}
                {selectedKeys.length === 2 && (
                    <p className="pres-hint">
                        Para cambiar un presidente, haz clic en uno de los seleccionados para quitarlo primero
                    </p>
                )}

                {/* ── BANNER VS (MORTAL KOMBAT) ── */}
                {vsBannerVisible && presA && presB && (
                    <div className={`vs-banner ${vsBannerVisible ? 'vs-banner-enter' : ''}`}>
                        {/* Lado A */}
                        <div className="vs-side vs-side-left" style={{ '--pres-color': presA.color, '--pres-glow': presA.color + '40' }}>
                            <div className="vs-glow-bg" />
                            <img src={presA.photo} alt={presA.displayName} className="vs-photo vs-photo-left" />
                            <div className="vs-info vs-info-left">
                                <h2 className="vs-name">{presA.displayName}</h2>
                                <p className="vs-role">Presidente de Colombia</p>
                                <p className="vs-period" style={{ color: presA.color }}>{presA.period}</p>
                            </div>
                        </div>

                        {/* Centro VS */}
                        <div className="vs-center">
                            <div className="vs-logo">
                                <div className="vs-spark vs-spark-1" />
                                <div className="vs-spark vs-spark-2" />
                                <div className="vs-spark vs-spark-3" />
                                <span className="vs-text">VS</span>
                            </div>
                        </div>

                        {/* Lado B */}
                        <div className="vs-side vs-side-right" style={{ '--pres-color': presB.color, '--pres-glow': presB.color + '40' }}>
                            <div className="vs-glow-bg" />
                            <div className="vs-info vs-info-right">
                                <h2 className="vs-name">{presB.displayName}</h2>
                                <p className="vs-role">Presidente de Colombia</p>
                                <p className="vs-period" style={{ color: presB.color }}>{presB.period}</p>
                            </div>
                            <img src={presB.photo} alt={presB.displayName} className="vs-photo vs-photo-right" />
                        </div>
                    </div>
                )}

                {/* ── SELECTOR DE INDICADORES ── */}
                {kpiSectionVisible && (
                    <div className="kpi-selector-section">
                        <div className="kpi-selector-header">
                            <span className="kpi-selector-title">Selecciona los indicadores a comparar</span>
                            <button className="kpi-select-all-btn" onClick={selectAllKpis}>
                                {activeKpis.length === KPI_CONFIG.length ? 'Quitar todos' : 'Seleccionar todos'}
                            </button>
                        </div>
                        <div className="kpi-pills-row">
                            {KPI_CONFIG.map((kpi, i) => (
                                <button
                                    key={kpi.key}
                                    className={`kpi-pill ${activeKpis.includes(kpi.key) ? 'kpi-pill-active' : ''}`}
                                    onClick={() => toggleKpi(kpi.key)}
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <span>{kpi.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── GRÁFICAS ── */}
                {presA && presB && activeKpiConfigs.length > 0 && (
                    <div className="comp-cards-grid">
                        {activeKpiConfigs.map((kpi, i) => (
                            <div key={kpi.key} className="comp-card-wrapper" style={{ animationDelay: `${i * 80}ms` }}>
                                <CompCard
                                    kpi={kpi}
                                    presA={presA}
                                    presB={presB}
                                    rowsA={rowsA}
                                    rowsB={rowsB}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Estado vacío — indicadores */}
                {presA && presB && activeKpiConfigs.length === 0 && kpiSectionVisible && (
                    <div className="comp-empty">
                        <p>Selecciona al menos un indicador arriba para ver la comparación</p>
                    </div>
                )}

            </div>
        </div>
    );
}
