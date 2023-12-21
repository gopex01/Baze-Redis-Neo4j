export class Registration {
  Id: string;
  TeamName: string;
  NumberOfHeadphones: number;
  NumberOfPCs: number;
  NumberOfKeyboards: number;
  NumberOfMouses: number;
  PlayerId:string;

  constructor(
    TeamName: string,
    NumberOfHeadphones: number,
    NumberOfPcs: number,
    NumberOfKeyboards: number,
    NumberOfMouses: number,
    PlayerId:string
  ) {
    this.Id = generateUniqueId(); // Generisanje jedinstvenog ID-a
    this.TeamName = TeamName;
    this.NumberOfHeadphones = NumberOfHeadphones;
    this.NumberOfPCs = NumberOfPcs;
    this.NumberOfKeyboards = NumberOfKeyboards;
    this.NumberOfMouses = NumberOfMouses;
    this.PlayerId=PlayerId;
  }
}

// Funkcija za generisanje jedinstvenog ID-a (može biti kompleksnija u stvarnom okruženju)
function generateUniqueId(): string {
  return Date.now().toString(); // Ovo je jednostavan način generisanja ID-a; trebali biste koristiti nešto pouzdanije u stvarnoj aplikaciji
}
