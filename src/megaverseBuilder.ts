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
          
          // Check for the type of entity and create it accordingly
          switch (true) {
            case entity === 'POLYANET':
              createPolyanet(row, col);
              break;
              
            case entity.includes('SOLOON'):
              // Extract the color from the entity string (e.g., "RED_SOLOON" -> "RED")
              const soloonColor = entity.split('_')[0].toLowerCase();
              createSoloon(row, col, soloonColor);
              break;

            case entity.includes('COMETH'):
              // Extract the direction from the entity string (e.g., "UP_COMETH" -> "UP")
              const comethDirection = entity.split('_')[0].toLowerCase();
              createCometh(row, col, comethDirection);
              break;

            default:
              // Logger.debug(`Skipping entity at row ${row}, column ${col} as it's SPACE.`);
          }
        }
      }
      
      Logger.info('🎉 Complex Megaverse pattern created successfully!');
    } catch (error) {
      Logger.error(`❌ Error creating complex Megaverse pattern: ${error}`);
    }
  }
}
