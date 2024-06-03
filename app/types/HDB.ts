export interface HDBRecord {
  blk_no: string;
  street: string;
  max_floor_lvl: number;
  year_completed: number;
  residential: boolean;
  commercial: boolean;
  market_hawker: boolean;
  miscellaneous: boolean;
  multistorey_carpark: boolean;
  precinct_pavilion: boolean;
  bldg_contract_town: string;
  ['1room_sold']: number;
  ['2room_sold']: number;
  ['3room_sold']: number;
  ['4room_sold']: number;
  ['5room_sold']: number;
  exec_sold: number;
  multigen_sold: number;
  studio_apartment_sold: number;
  ['1room_rental']: number;
  ['2room_rental']: number;
  ['3room_rental']: number;
  other_room_rental: number;
}
