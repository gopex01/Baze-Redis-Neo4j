export class Registration {
  Id: string;
  Username: string;
  Password: string;

  constructor(username: string, password: string) {
    this.Id = generateUniqueId(); // Generisanje jedinstvenog ID-a
    this.Username = username;
    this.Password = password;
  }
}

// Funkcija za generisanje jedinstvenog ID-a (može biti kompleksnija u stvarnom okruženju)
function generateUniqueId(): string {
  return Date.now().toString(); // Ovo je jednostavan način generisanja ID-a; trebali biste koristiti nešto pouzdanije u stvarnoj aplikaciji
}
