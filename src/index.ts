// src/index.ts
import { MegaverseBuilder } from './megaverseBuilder';

const main = async () => {
  // const gridSize = 11; // Default grid size for Phase 2

  const megaverseBuilder = new MegaverseBuilder();

  try {
    console.log('🚀 Starting Megaverse Creation based on Goal Map...');
    await megaverseBuilder.buildMegaverse();
  } catch (error) {
    console.error('❌ Error during Megaverse creation:', error);
  }
};

main();
