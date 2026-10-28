import { useEffect, useState } from "react";
import BoltiPerfil from "./BoltiPerfil.jsx";
import "./PaseoInvencible.css";

// La escena de cuando el caballo patea a Bolti (secreto INVENCIBLE), con el juego en pausa:
// 1. impacto · 2. zoom a Bolti tirada en un cráter (mareada, sin lastimarse) · 3. se levanta con
// aura dorada y dice "SOY…" · 4. cartel INVENCIBLE como el de la serie (con letras propias).
const PASOS = [
  { nombre: "impacto", dura: 500 },
  { nombre: "tirada", dura: 3000 },
  { nombre: "levanta", dura: 3800 },
  { nombre: "titulo", dura: 3500 },
];

// Más altas en el medio, como el título de la serie
const LETRAS = "INVENCIBLE".split("");
const TAMANOS = [62, 68, 74, 80, 84, 84, 80, 74, 68, 62];

function PaseoInvencible({ onTerminar }) {
  const [paso, setPaso] = useState(0);
  const [fase, setFase] = useState(0); // para las estrellitas y el aura

  useEffect(() => {
    if (paso >= PASOS.length) {
      onTerminar();
      return;
    }
    const timer = setTimeout(() => setPaso((p) => p + 1), PASOS[paso].dura);
    return () => clearTimeout(timer);
  }, [paso, onTerminar]);

  useEffect(() => {
    const inicio = performance.now();
    let id = requestAnimationFrame(function cuadro(ahora) {
      setFase((ahora - inicio) / 1000);
      id = requestAnimationFrame(cuadro);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const actual = PASOS[paso]?.nombre;

  return (
    <div className={`paseo-invencible ${actual ?? ""}`} aria-live="polite">
      {actual === "impacto" && <div className="destello" />}

      {actual === "tirada" && (
        <div className="escena crater">
          <div className="zoom">
            <div className="agujero" />
            <div className="piedritas" />
            <div className="bolti-tirada">
              <BoltiPerfil pose="tirada" fase={fase} />
            </div>
          </div>
        </div>
      )}

      {actual === "levanta" && (
        <div className="escena aura-fondo">
          <div className="bolti-parada">
            {/* El aura es otra Bolti igual, agrandada y con llamas en punta por el filtro de abajo.
                Son 3 con llamas distintas que se turnan (cada filtro se dibuja una sola vez: es pesado) */}
            <div className="auras">
              {SEMILLAS_AURA.map((semilla, i) => (
                <div
                  key={semilla}
                  className="aura"
                  style={{
                    filter: `url(#aura-saiyajin-${i})`,
                    animationDelay: `${-i * 0.12}s`,
                  }}
                >
                  <BoltiPerfil pose="parada" />
                </div>
              ))}
            </div>
            <BoltiPerfil pose="parada" fase={fase} invencible />
          </div>
          <FiltrosAura />
          <span className="globo-soy-grande">SOY…</span>
        </div>
      )}

      {actual === "titulo" && (
        <div className="escena titulo">
          <svg
            viewBox="0 0 420 200"
            className="cartel-serie"
            role="img"
            aria-label="INVENCIBLE"
          >
            <defs>
              <path id="arco-invencible" d="M 14 150 Q 210 70 406 150" />
              <linearGradient
                id="relleno-invencible"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0" stopColor="#ffd9e7" />
                <stop offset="1" stopColor="#ec6f9e" />
              </linearGradient>
            </defs>
            {/* Sombra turquesa, corrida abajo a la derecha */}
            <text className="sombra" transform="translate(7 7)">
              <textPath
                href="#arco-invencible"
                startOffset="50%"
                textAnchor="middle"
                textLength="370"
                lengthAdjust="spacingAndGlyphs"
              >
                {LETRAS.map((l, i) => (
                  <tspan key={i} fontSize={TAMANOS[i]}>
                    {l}
                  </tspan>
                ))}
              </textPath>
            </text>
            <text className="letras">
              <textPath
                href="#arco-invencible"
                startOffset="50%"
                textAnchor="middle"
                textLength="370"
                lengthAdjust="spacingAndGlyphs"
              >
                {LETRAS.map((l, i) => (
                  <tspan key={i} fontSize={TAMANOS[i]}>
                    {l}
                  </tspan>
                ))}
              </textPath>
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}

// Aura de súper saiyajin con la forma de Bolti: se engorda la silueta, se estira para arriba, se le
// hacen picos con ruido vertical y se pinta con borde amarillo fuerte y el adentro amarillo
// transparente. Un filtro por semilla: cada una da llamas distintas
const SEMILLAS_AURA = [3, 11, 23];

function FiltrosAura() {
  return (
    <svg width="0" height="0" className="filtro-aura" aria-hidden="true">
      {SEMILLAS_AURA.map((semilla, i) => (
        <FiltroAura key={semilla} id={`aura-saiyajin-${i}`} semilla={semilla} />
      ))}
    </svg>
  );
}

function FiltroAura({ id, semilla }) {
  return (
    <filter
      id={id}
      x="-50%"
      y="-150%"
      width="200%"
      height="270%"
      colorInterpolationFilters="sRGB"
    >
      <feMorphology
        in="SourceAlpha"
        operator="dilate"
        radius="9"
        result="gorda"
      />
      <feGaussianBlur in="gorda" stdDeviation="4 26" result="estirada" />
      <feOffset in="estirada" dy="-28" result="arriba" />
      <feMerge result="llama">
        <feMergeNode in="gorda" />
        <feMergeNode in="arriba" />
      </feMerge>
      <feComponentTransfer in="llama" result="forma">
        <feFuncA type="discrete" tableValues="0 1 1 1" />
      </feComponentTransfer>
      {/* Picos: ruido que cambia rápido de izquierda a derecha y mueve solo para arriba y abajo */}
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.16 0.004"
        numOctaves="2"
        seed={semilla}
        result="ruidoPicos"
      />
      <feColorMatrix
        in="ruidoPicos"
        type="matrix"
        values="0 0 0 0 0.5  0 1 0 0 0  0 0 0 0 0  0 0 0 0 1"
        result="soloVertical"
      />
      <feDisplacementMap
        in="forma"
        in2="soloVertical"
        scale="70"
        xChannelSelector="R"
        yChannelSelector="G"
        result="conPicos"
      />
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.05"
        numOctaves="1"
        seed={semilla + 7}
        result="ruidoSuave"
      />
      <feDisplacementMap
        in="conPicos"
        in2="ruidoSuave"
        scale="12"
        xChannelSelector="R"
        yChannelSelector="G"
        result="picos"
      />
      <feMorphology in="picos" operator="erode" radius="5" result="adentro" />
      <feComposite in="picos" in2="adentro" operator="out" result="borde" />
      <feMorphology in="picos" operator="dilate" radius="1.5" result="afuera" />
      <feComposite in="afuera" in2="picos" operator="out" result="linea" />
      <feFlood floodColor="#fff47a" floodOpacity="0.5" />
      <feComposite in2="adentro" operator="in" result="relleno" />
      <feFlood floodColor="#ffee3a" />
      <feComposite in2="borde" operator="in" result="bordeAmarillo" />
      <feFlood floodColor="#7a6a1a" floodOpacity="0.8" />
      <feComposite in2="linea" operator="in" result="lineaOscura" />
      <feGaussianBlur in="bordeAmarillo" stdDeviation="3" result="brillo" />
      <feMerge>
        <feMergeNode in="relleno" />
        <feMergeNode in="brillo" />
        <feMergeNode in="bordeAmarillo" />
        <feMergeNode in="lineaOscura" />
      </feMerge>
    </filter>
  );
}

export default PaseoInvencible;
