import { Logger } from './utils/logger';
import { Polyanet, Soloon, Cometh } from './entities';
import { MegaverseAPIClient } from './apiClient';

export class MegaverseBuilder {
  private apiClient: MegaverseAPIClient;

  constructor() {
    this.apiClient = new MegaverseAPIClient();
  }

  public async buildMegaverse(): Promise<void> {
    try {
      Logger.info('Fetching the goal map for the candidate...');
      const goalMap = await this.apiClient.getGoalMap(); // Use the updated API client to get the goal map
      Logger.info('Successfully fetched the goal map.');

      // Traverse the goal map and instantiate the appropriate entity classes
      for (let row = 0; row < goalMap.length; row++) {
        for (let col = 0; col < goalMap[row].length; col++) {
          const entity = goalMap[row][col];

          let entityObject: Polyanet | Soloon | Cometh | null = null;

          switch (true) {
            case entity === 'POLYANET':
              entityObject = new Polyanet(row, col);
              break;

            case entity.includes('SOLOON'):
              const soloonColor = entity.split('_')[0].toLowerCase();
              entityObject = new Soloon(row, col, soloonColor);
              break;

            case entity.includes('COMETH'):
              const comethDirection = entity.split('_')[0].toLowerCase();
              entityObject = new Cometh(row, col, comethDirection);
              break;

            default:
              Logger.debug(`Skipping entity at row ${row}, column ${col} as it's SPACE.`);
          }

          // Create the entity if it's a valid type
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
