export function getEncouragementMessage(score: number): string {
  if (score >= 80) return "Solide ! Tu maîtrises les bases de ce module.";
  if (score >= 50) return "Bonne base, quelques points à consolider.";
  return "Une relecture du module pourrait aider.";
}
