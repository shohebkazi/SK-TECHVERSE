import LightPillar from './LightPillar';
import { useTheme } from '../context/ThemeContext';

export default function AmbientBackground() {
  const theme = useTheme();
  const dark = theme?.dark ?? false;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: dark ? 0.55 : 0.32,
      }}
      aria-hidden="true"
    >
      <LightPillar
        // Dark (neon) theme keeps the original vivid blue→purple beam.
        // Light (premium) theme uses royal→cyan and a gentler blend mode,
        // since "screen" washes out against a white page background.
        topColor={dark ? '#7c3aed' : '#6D28D9'}
        bottomColor={dark ? '#d946ef' : '#C026D3'}
        intensity={dark ? 0.9 : 0.65}
        rotationSpeed={0.12}
        glowAmount={0.0035}
        pillarWidth={3.4}
        pillarHeight={0.32}
        noiseIntensity={0.25}
        interactive={false}
        mixBlendMode={dark ? 'screen' : 'multiply'}
        quality="medium"
      />
    </div>
  );
}