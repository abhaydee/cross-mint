// src/megaverseBuilder.ts
import { getGoalMap, createPolyanet, createSoloon, createCometh } from './apiClient';
import { Logger } from './utils/logger';

export class MegaverseBuilder {
  public async buildMegaverse(): Promise<void> {
    try {
      Logger.info('Fetching the goal map for the candidate...');
      const goalMap = await getGoalMap();
      Logger.info('Successfully fetched the goal map.');

      // Traverse the goal map and create the appropriate entities
      for (let row = 0; row < goalMap.length; row++) {
        for (let col = 0; col < goalMap[row].length; col++) {
          const entity = goalMap[row][col];
          this.createEntityFromGoalMap(row, col, entity);
        }
      }

      Logger.info('🎉 Complex Megaverse pattern created successfully!');
    } catch (error) {
      Logger.error(`❌ Error creating complex Megaverse pattern: ${error}`);
    }
  }

  private createEntityFromGoalMap(row: number, col: number, entity: string): void {
    switch (true) {
      case entity === 'POLYANET':
        createPolyanet(row, col);
        break;
      case entity.includes('SOLOON'):
        const soloonColor = entity.split('_')[0].toLowerCase(); // Extract color
        createSoloon(row, col, soloonColor);
        break;
      case entity.includes('COMETH'):
        const comethDirection = entity.split('_')[0].toLowerCase(); // Extract direction
        createCometh(row, col, comethDirection);
        break;
      default:
        // Skip spaces
    }
  }
}
