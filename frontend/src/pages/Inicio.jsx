import React from 'react';
import './Inicio.css'; // ¡Súper importante para la animación!

export default function Inicio() {
    return (
        <>
            {/* Esta capa es la imagen gigante animada en el fondo */}
            <div className="hero-background"></div>

            {/* Este es el contenedor de los textos */}
            <div className="inicio-container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '75vh'
            }}>
                <div className="hero-text" style={{ textAlign: 'center', zIndex: 10 }}>
                    <h1 className="glow-title text-shadow-epic" style={{ fontSize: '4rem', letterSpacing: '5px' }}>
                        DATA'S COLOMBIA
                    </h1>
                    <p className="subtitle text-shadow-epic" style={{
                        color: 'var(--colombia-yellow)',
                        fontSize: '1rem',
                        letterSpacing: '8px',
                        marginTop: '10px'
                    }}>
                        ESTADÍSTICAS GUBERNAMENTALES 1990 - 2025
                    </p>
                </div>
            </div>
        </>
    );
}

