// src/megaverseBuilder.ts
import { getGoalMap, createPolyanet, createSoloon, createCometh } from './apiClient';
import { Logger } from './utils/logger';

/**
 * Builder class responsible for creating entities in the Megaverse.
 */
export class MegaverseBuilder {
  /**
   * Constructs the entire Megaverse by parsing the goal map.
   */
  public async buildMegaverse(): Promise<void> {
    try {
      Logger.info('📡 Initiating goal map fetch for candidate...');
      const goalMap = await getGoalMap();
      Logger.info('🗺️ Successfully retrieved goal map for processing.');

      // Traverse the goal map and create the appropriate entities
      for (let row = 0; row < goalMap.length; row++) {
        for (let col = 0; col < goalMap[row].length; col++) {
          const entity = goalMap[row][col];
          this.createEntityFromGoalMap(row, col, entity);
        }
      }

      Logger.info('🎉 Megaverse construction completed successfully!');
    } catch (error) {
      Logger.error(`❌ Error while constructing Megaverse: ${error}`);
    }
  }

  /**
   * Creates entities based on the type found in the goal map.
   * @param row The row index in the map.
   * @param col The column index in the map.
   * @param entity The entity type found in the goal map.
   */
  private createEntityFromGoalMap(row: number, col: number, entity: string): void {
    switch (true) {
      case entity === 'POLYANET':
        createPolyanet(row, col);
        Logger.info(`Creating Polyanet at (${row}, ${col})`);
        break;
        
      case entity.includes('SOLOON'):
        const soloonColor = this.extractSoloonColor(entity);
        createSoloon(row, col, soloonColor);
        Logger.info(`Creating ${soloonColor} Soloon at (${row}, ${col})`);
        break;

      case entity.includes('COMETH'):
        const comethDirection = this.extractComethDirection(entity);
        createCometh(row, col, comethDirection);
        Logger.info(`Creating ${comethDirection} Cometh at (${row}, ${col})`);
        break;

      default:
        // Skip spaces and undefined entities.
        // Logger.debug(`Skipping empty entity at (${row}, ${col}).`);
    }
  }

  /**
   * Helper function to extract the color from Soloon entities.
   * @param entity The entity string (e.g., "RED_SOLOON").
   * @returns Lowercase color string.
   */
  private extractSoloonColor(entity: string): string {
    return entity.split('_')[0].toLowerCase();
  }

  /**
   * Helper function to extract the direction from Cometh entities.
   * @param entity The entity string (e.g., "UP_COMETH").
   * @returns Lowercase direction string.
   */
  private extractComethDirection(entity: string): string {
    return entity.split('_')[0].toLowerCase();
  }
}
