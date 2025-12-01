
export interface MealOption {
  id: number;
  name: string;
  description?: string;
}

export interface Meal {
  id: number;
  participant_id: number;
  mealOption: MealOption;
  mealOptionId: number;
  date: string;
  served_at: Date;
}
