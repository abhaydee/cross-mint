// src/megaverseBuilder.ts
import { createPolyanet, createSoloon, createCometh, getGoalMap } from './apiClient';

export class MegaverseBuilder {
  private gridSize: number;

  constructor(gridSize: number = 11) {
    this.gridSize = gridSize;
  }

  // Create Megaverse pattern based on the goal map
  public async createComplexPattern(): Promise<void> {
    try {
      const goalMap = await getGoalMap();
      const promises: Promise<void>[] = [];

      // Iterate through each cell in the goal map and create the appropriate object
      for (let row = 0; row < goalMap.length; row++) {
        for (let column = 0; column < goalMap[row].length; column++) {
          const cell = goalMap[row][column];

          if (cell === 'POLYANET') {
            await createPolyanet(row, column);
          } else if (cell.startsWith('SOLOON')) {
            const color = cell.split('_')[1].toLowerCase(); // Extract the color (e.g., 'SOLOON_BLUE')
            await createSoloon(row, column, color);
          } else if (cell.startsWith('COMETH')) {
            const direction = cell.split('_')[1].toLowerCase(); // Extract the direction (e.g., 'COMETH_UP')
            await createCometh(row, column, direction);
          }
        }
      }
      console.log('🎉 Complex Megaverse pattern created successfully!');
    } catch (error) {
      console.error('❌ Error creating complex Megaverse pattern:', error);
    }
  }
}
