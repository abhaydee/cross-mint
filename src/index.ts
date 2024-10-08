import { MegaverseBuilder } from "./megaVerse";

const main = async ()=>{
    const gridSize = 11;
    const megaverseBuilder = new MegaverseBuilder(gridSize);
    try{
        console.log("Starting megaverse x-shape creation")
        await megaverseBuilder.createXShape();
    }

    catch(error){
        console.log("Error during megaverse creation", error)
    }
}