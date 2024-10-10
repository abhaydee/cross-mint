import { MegaverseAPIClient } from './apiClient';

const megaverseApiClient = new MegaverseAPIClient();

// Base class representing a generic Megaverse entity
class Entity {
  constructor(public row: number, public column: number) {}

  // Common logging functionality for all entities
  logCreation(): void {
    console.log(`Creating entity at row: ${this.row}, column: ${this.column}`);
  }
}

// Polyanet entity class extending Entity base class
export class Polyanet extends Entity {
  async create(): Promise<void> {
    this.logCreation();
    await megaverseApiClient.createPolyanet(this.row, this.column);
  }
}

// Soloon entity class extending Entity base class
export class Soloon extends Entity {
  constructor(row: number, column: number, private color: string) {
    super(row, column);
  }

  async create(): Promise<void> {
    this.logCreation();
    await megaverseApiClient.createSoloon(this.row, this.column, this.color);
  }
}

// Cometh entity class extending Entity base class
export class Cometh extends Entity {
  constructor(row: number, column: number, private direction: string) {
    super(row, column);
  }

  async create(): Promise<void> {
    this.logCreation();
    await megaverseApiClient.createCometh(this.row, this.column, this.direction);
  }
}
