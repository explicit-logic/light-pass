import type { Answer } from '@/models/Answer';

export function retrieveAnswer(entity: Answer, question: string) {
  const answer = entity?.answer?.[question];
  if (Array.isArray(answer)) return answer;

  if (typeof answer === 'string') return [answer];

  return [];
}
