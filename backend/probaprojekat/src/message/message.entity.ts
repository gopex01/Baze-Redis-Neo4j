export class MessageEntity {
  id: string;
  messageText: string;
  time: string;
  status: string; // Može biti enum sa različitim statusima
  playerId: string; // ID igrača
  tournamentId: string; // ID turnira
  constructor(messageText: string, status: string) {
    this.id = generateUniqueId();
    this.messageText = messageText;
    this.time = getCurrentTime();
    this.status = status;
    //idijevi se postavljaju tamo gde se poziva
  }
}
function generateUniqueId(): string {
  return Date.now().toString();
}
function getCurrentTime(): string {
  const currentTime = new Date();
  const timeWithoutSeconds = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return timeWithoutSeconds;
}
