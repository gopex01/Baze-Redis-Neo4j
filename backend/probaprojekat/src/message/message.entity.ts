export class MessageEntity {
  id: string;
  messageText: string;
  time: string;
  status: string; // Može biti enum sa različitim statusima
  playerId: string; // ID igrača
  tournamentId: string; // ID turnira
  constructor(
    messageText: string,
    timestamp: string,
    status: string,
    playerId: string,
    tournamentId: string,
  ) {
    this.id = generateUniqueId();
    this.messageText = messageText;
    this.time = timestamp;
    this.status = status;
    this.playerId = playerId;
    this.tournamentId = tournamentId;
  }
}
function generateUniqueId(): string {
  return Date.now().toString();
}
