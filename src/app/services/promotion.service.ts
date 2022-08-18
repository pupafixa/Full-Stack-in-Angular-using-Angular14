import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  getPromotions(): Promise<Promotion[]> {
    return new Promise(resolve => {
      //Simulate sever latency with 2 seconds
      setTimeout(() => resolve(PROMOTIONS), 2000);
    });
  }

  getPromotion(id: String): Promise<Promotion> {

    return new Promise(resolve => {
      //Simulate sever latency with 2 seconds
      setTimeout(() => resolve(PROMOTIONS.filter((promo) => (promo.id === id))[0]), 2000);
    });
       
  }

  getFeaturedPromotion(): Promise<Promotion> {
    return new Promise(resolve => {
      // Simulate sever latency with 2 seconds
      setTimeout(() => resolve (PROMOTIONS.filter((promo) => (promo.id))[0]), 2000);
    });
  }
}
