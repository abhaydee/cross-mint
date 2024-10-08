import {createPolynet, deletePolynet} from "./apiClient";

export class MegaverseBuilder{
    private gridSize : number;

    constructor(gridSize : number){
        this.gridSize = gridSize;
    }
    
    public async createXShape():Promise<void>{
        try{
            const positions = this.getShapePositions();
        }
        catch(error){
            console.log("failed to create x shape", error)
        }
    }

    private  getShapePositions():{row: number, column: number}[] {
        const positions : {row:number, column:number}[] = []

       for(let row=0;row<this.gridSize;row++){
            positions.push({row, column : row})
            if(row!== this.gridSize - row -1){
                positions.push({row,  column: this.gridSize - row -1})
            }
       }

       return positions
    }

    public async clearXShape():Promise<void>{
        try{
            const positions = this.getShapePositions();
            await Promise.all(positions.map(({row, column}) => deletePolynet(row, column)))
        }

        catch(error){
            console.log('failed to clear x shape', error)
        }
    }
}