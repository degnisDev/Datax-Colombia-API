import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// Nombres bonitos para la leyenda
const DISPLAY_NAMES = {
    Gaviria: 'Gaviria', Samper: 'Samper', Pastrana: 'Pastrana',
    Uribe_1: 'Uribe I', Uribe_2: 'Uribe II',
    Santos_1: 'Santos I', Santos_2: 'Santos II',
    Duque: 'Duque', Petro: 'Petro',
};

// Fotos de los presidentes (para la leyenda inferior)
const PRESIDENT_PHOTOS = {
    Gaviria: '/presidents/Cesar_Gaviria.webp',
    Samper: '/presidents/Ernesto_Samper.jpg',
    Pastrana: '/presidents/Andres_Pastrana.jpg',
    Uribe_1: '/presidents/Alvaro_Uribe_1.jpg',
    Uribe_2: '/presidents/Alvaro_Uribe_2.jpg',
    Santos_1: '/presidents/Juan_Santos_1.jpg',
    Santos_2: '/presidents/Juan_Santos_2.jpg',
    Duque: '/presidents/Ivan_Duque.jpg',
    Petro: '/presidents/Gustavo_Petro.jpg',
};

// Bolita de color reutilizable
function Dot({ color }) {
    return (
        <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: color, display: 'inline-block', flexShrink: 0,
        }} />
    );
}

// Tooltip personalizado (sin fotos, formato limpio)
function CustomTooltip({ active, payload }) {
    if (!active || !payload || !payload[0]) return null;
    const d = payload[0].payload;

    return (
        <div style={{
            background: 'rgba(10,14,26,0.95)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px', padding: '14px 18px', backdropFilter: 'blur(10px)',
        }}>
            {/* Año + etiqueta de transición */}
            <p style={{ color: '#fff', fontWeight: 700, marginBottom: 8, fontSize: '0.95rem' }}>
                {d.year}{d.transition ? ' · Transición' : ''}
            </p>

            {/* Presidentes con bolitas de color */}
            {d.transition ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Dot color={d.outgoing_color} />
                    <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{DISPLAY_NAMES[d.outgoing]}</span>
                    <span style={{ color: '#555' }}>—</span>
                    <Dot color={d.incoming_color} />
                    <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{DISPLAY_NAMES[d.incoming]}</span>
                </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Dot color={d.color} />
                    <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{DISPLAY_NAMES[d.president]}</span>
                </div>
            )}

            {/* Valor total (sin dividir) */}
            <p style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', margin: 0 }}>
                {d.value.toFixed(2)}
            </p>
        </div>
    );
}

export default function PresidentChart({ indicador, indicadorLabel }) {
    const [chartData, setChartData] = useState([]);
    const [colors, setColors] = useState({});
    const [presidents, setPresidents] = useState([]);
    const [activePresident, setActivePresident] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/data/chart?indicador=${indicador}`)
            .then(res => res.json())
            .then(json => {
                setChartData(json.data);
                setColors(json.colors);
                setPresidents(json.presidents);
            })
            .catch(err => console.error('Error cargando chart:', err));
    }, [indicador]);

    if (!chartData.length) return null;

    // ¿Debe brillar esta barra según el filtro activo?
    const isHighlighted = (entry) => {
        if (!activePresident) return true;
        if (entry.president === activePresident) return true;
        if (entry.transition && (entry.outgoing === activePresident || entry.incoming === activePresident)) return true;
        return false;
    };

    return (
        <div>
            <h3 style={{ color: 'var(--colombia-yellow)', textAlign: 'center', marginBottom: 8, fontSize: '1.1rem' }}>
                📊 {indicadorLabel} — Evolución Histórica (1990–2025)
            </h3>

            <ResponsiveContainer width="100%" height={380}>
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    {/* Gradientes SVG para los años de transición */}
                    <defs>
                        {chartData.filter(d => d.transition).map(d => (
                            <linearGradient key={`grad-${d.year}`} id={`grad-${d.year}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={d.outgoing_color} />
                                <stop offset="45%" stopColor={d.outgoing_color} />
                                <stop offset="55%" stopColor={d.incoming_color} />
                                <stop offset="100%" stopColor={d.incoming_color} />
                            </linearGradient>
                        ))}
                    </defs>

                    <XAxis
                        dataKey="year" tick={{ fill: '#888', fontSize: 11 }}
                        axisLine={{ stroke: '#333' }} tickLine={false}
                    />
                    <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />

                    {/* Una sola barra por año, coloreada individualmente con Cell */}
                    <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry.transition ? `url(#grad-${entry.year})` : entry.color}
                                opacity={isHighlighted(entry) ? 1 : 0.1}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Leyenda con fotos de presidentes */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                gap: '12px', marginTop: '16px',
            }}>
                {presidents.map(pres => (
                    <div
                        key={pres}
                        onClick={() => setActivePresident(activePresident === pres ? null : pres)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                            padding: '6px 12px', borderRadius: '100px',
                            background: activePresident === pres ? 'rgba(255,255,255,0.1)' : 'transparent',
                            border: `1px solid ${activePresident === pres ? colors[pres] : 'transparent'}`,
                            transition: 'all 0.3s ease',
                            opacity: activePresident === null || activePresident === pres ? 1 : 0.3,
                        }}
                    >
                        <img
                            src={PRESIDENT_PHOTOS[pres]} alt={pres}
                            style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${colors[pres]}` }}
                        />
                        <span style={{ color: colors[pres], fontSize: '0.95rem', fontWeight: 700 }}>
                            {DISPLAY_NAMES[pres]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
