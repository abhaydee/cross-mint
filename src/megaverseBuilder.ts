import { megaverseAPI } from './apiClient';
import { Logger } from './utils/logger';
import { Polyanet, Soloon, Cometh, Entity } from './entities';

export class MegaverseBuilder {
  // Main method to build the Megaverse
  public async buildMegaverse(): Promise<void> {
    try {
      Logger.info('Fetching the goal map for the candidate...');
      const goalMap = await megaverseAPI.getGoalMap();
      Logger.info('Successfully fetched the goal map.');

      // Logging the entire goal map for debugging purposes
      Logger.info(`Goal Map: \n${goalMap.map((row) => row.join(' ')).join('\n')}`);

      // Traversing the goal map and instantiate the appropriate entity classes
      for (let row = 0; row < goalMap.length; row++) {
        for (let col = 0; col < goalMap[row].length; col++) {
          const entity = goalMap[row][col];

          let entityObject: Entity | null = null;

          switch (true) {
            case entity.trim() === 'POLYANET':
              Logger.info(`Creating POLYANET at row ${row}, col ${col}`);
              entityObject = new Polyanet(row, col, megaverseAPI);
              break;

            case entity.includes('SOLOON'):
              const soloonColor = entity.split('_')[0].toLowerCase();
              Logger.info(`Creating ${soloonColor.toUpperCase()} SOLOON at row ${row}, col ${col}`);
              entityObject = new Soloon(row, col, soloonColor, megaverseAPI);
              break;

            case entity.includes('COMETH'):
              const comethDirection = entity.split('_')[0].toLowerCase();
              Logger.info(`Creating ${comethDirection.toUpperCase()} COMETH at row ${row}, col ${col}`);
              entityObject = new Cometh(row, col, comethDirection, megaverseAPI);
              break;

            default:
              Logger.info(`Skipping entity at row ${row}, column ${col} as it's SPACE.`);
          }

          // Creating the entity if it's a valid type
          if (entityObject) {
            await entityObject.create();
          }
        }
      }

      Logger.info('🎉 Complex Megaverse pattern created successfully!');
    } catch (error) {
      Logger.error(`❌ Error creating complex Megaverse pattern: ${error}`);
    }
  }
}
