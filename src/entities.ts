import { MegaverseAPIClient } from './apiClient';

// Base class representing a generic Megaverse entity
export abstract class Entity {
  constructor(protected row: number, protected column: number, protected apiClient: MegaverseAPIClient) {}

  // Abstract method to be implemented by subclasses
  abstract create(): void;
}

// Polyanet entity class
export class Polyanet extends Entity {
  create(): void {
    this.apiClient.createPolyanet(this.row, this.column);
  }
}

// Soloon entity class with a color attribute
export class Soloon extends Entity {
  constructor(row: number, column: number, private color: string, apiClient: MegaverseAPIClient) {
    super(row, column, apiClient);
  }

  create(): void {
    this.apiClient.createSoloon(this.row, this.column, this.color);
  }
}

// Cometh entity class with a direction attribute
export class Cometh extends Entity {
  constructor(row: number, column: number, private direction: string, apiClient: MegaverseAPIClient) {
    super(row, column, apiClient);
  }

  create(): void {
    this.apiClient.createCometh(this.row, this.column, this.direction);
  }
}
