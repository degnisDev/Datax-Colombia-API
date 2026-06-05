import React from 'react';
import './Inicio.css'; // ¡Súper importante para la animación!

export default function Inicio() {
    const aspectos = [
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

    return (
        <>
            {/* Esta capa es la imagen gigante animada en el fondo */}
            <div className="hero-background"></div>

            {/* Este es el contenedor de los textos */}
            <div className="inicio-container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '75vh',
                position: 'relative'
            }}>
                <div className="hero-text" style={{ textAlign: 'center', zIndex: 10, padding: '0 20px' }}>
                    <h1 className="glow-title text-shadow-epic inicio-title" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', letterSpacing: 'clamp(2px, 1vw, 5px)' }}>
                        DATA'S COLOMBIA
                    </h1>
                    <p className="subtitle text-shadow-epic inicio-subtitle" style={{
                        color: 'var(--colombia-yellow)',
                        fontSize: 'clamp(1rem, 4vw, 2rem)',
                        letterSpacing: 'clamp(3px, 2vw, 8px)',
                        marginTop: 'clamp(15px, 4vw, 30px)'
                    }}>
                        ESTADÍSTICAS GUBERNAMENTALES 1990 - 2025
                    </p>
                </div>
            </div>

            {/* Marquee Ticker de Wall Street */}
            <div className="ticker-container">
                <div className="ticker-track">
                    {/* Renderizamos la lista dos veces para el efecto infinito */}
                    {[...aspectos, ...aspectos].map((aspecto, index) => (
                        <div key={index} className="ticker-item" style={{ color: aspecto.color }}>
                            {aspecto.name}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

