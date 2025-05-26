
import { createContext } from "react";
import { storeDataStore } from "./store";

export const StoreContext = createContext({ 
  
    storeDataStore: storeDataStore,

});