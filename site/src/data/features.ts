export interface Feature {
  name: string;
  /** Shown as a tooltip on hover. */
  hint: string;
}

export const FEATURES: Feature[] = [
  { name: "Asset Library · 14k+", hint: "Textures, beams, meshes, sounds, mesh flipbooks and more" },
  { name: "Emit window", hint: "Emit, enable and disable VFX in a click" },
  { name: "Color picker", hint: "For ParticleEmitters, Beams and Trails" },
  { name: "shared.sv API", hint: "Global Studio API for the command bar" },
  { name: "Particle counter", hint: "How many particles are alive" },
  { name: "Path & spawn visualizers", hint: "See where particles spawn and travel" },
  { name: "Runtime module", hint: "Play Sine VFX effects in-game" },
  { name: "Graph & gradient editor", hint: "Draw NumberSequences with real curves" },
  { name: "Trail preview", hint: "See trails move without pressing Play" },
  { name: "Retimer & resizer", hint: "Retime or scale a whole effect at once" },
  { name: "Property copier", hint: "Copy emitter settings to many instances" },
  { name: "Property shifter", hint: "Shift a property across a selection" },
  { name: "Custom properties", hint: "Extra controls Roblox doesn't give you" },
  { name: "3D particles", hint: "Mesh VFX that behave like ParticleEmitters" },
  { name: "Mesh flipbooks", hint: "Frame-by-frame animated meshes" },
  { name: "Transformed trails & beams", hint: "Trails and beams that grow, spin and shift" },
  { name: "Transformed highlights & lights", hint: "Animate Highlights and lights with the effect" },
  { name: "Screen effects", hint: "Camera shake, blur, FOV, impact frames" },
  { name: "Beziers & splines", hint: "Send VFX along editable curves" },
  { name: "Craters", hint: "Ground impacts around a hit" },
  { name: "Trail lightning", hint: "Jagged bolts made from trails" },
  { name: "3D lightning", hint: "Branching bolts in full 3D" },
  { name: "Custom themes", hint: "Themes and settings your way" },
];
