import getStoreDataApi from 'apis/delivery/get-store';
import updateStoreDataApi from 'apis/delivery/update-store';
import { makeAutoObservable } from 'mobx';

class StoreDataStore {
  storeData: any = {};

  constructor() {
    makeAutoObservable(this);
  }

  setStoreData(storeD: any) {
    this.storeData = storeD;
  }
  async updateStore(isStoreClose: boolean) {
    await updateStoreDataApi(isStoreClose, this.storeData._id)
    const res = await getStoreDataApi();
    this.storeData = res[0];
  }
 
}

export const storeDataStore = new StoreDataStore();
