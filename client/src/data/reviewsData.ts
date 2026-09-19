export interface Review {
  id: string;
  name: string;
  location: string;
  deviceBought: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export const CUSTOMER_REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Fasalu Rahiman',
    location: 'Kootanad',
    deviceBought: 'iPhone 15 Pro 256GB (Pre-Owned)',
    rating: 5,
    comment: 'Bought iPhone 15 Pro from M Store Kootanad branch. Battery health was exactly 96% as stated. Very smooth dealing via WhatsApp and clear explanation of condition.',
    date: '2 weeks ago',
    verified: true,
  },
  {
    id: 'r2',
    name: 'Anjali Menon',
    location: 'Kecheri',
    deviceBought: 'iPhone 14 (Brand New)',
    rating: 5,
    comment: 'Best price for new sealed iPhones in Thrissur/Kecheri area! Friendly staff and hassle-free quick payment and setup service.',
    date: '1 month ago',
    verified: true,
  },
  {
    id: 'r3',
    name: 'Muhammed Rishad',
    location: 'Mattom',
    deviceBought: 'iPhone 13 Pro 256GB',
    rating: 5,
    comment: 'Very satisfied with M Store Mattom branch. They checked all 40 points in front of me including True Tone and Face ID. Genuine pre-owned store.',
    date: '3 weeks ago',
    verified: true,
  },
  {
    id: 'r4',
    name: 'Vipin Das',
    location: 'Pattambi / Kootanad',
    deviceBought: 'AirPods Pro 2 + 20W Charger',
    rating: 5,
    comment: 'Got original Apple 20W charger and AirPods Pro 2 at discounted price. Prompt reply on WhatsApp and same-day store pickup.',
    date: '5 days ago',
    verified: true,
  },
];
