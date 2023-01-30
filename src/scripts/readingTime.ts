const WORDS_PER_MINUTE = 200;

export function getReadingTime(content: string) {
  if (!content) return;
  const clean = content.replace(/<\/?[^>]+(>|$)/g, '');
  const numberOfWords = clean.split(/\s/g).length;
  const minutes = Math.ceil(numberOfWords / WORDS_PER_MINUTE);

  if (minutes !== 1) {
    return `${minutes} minutes to read`;
  }

  return `${minutes} minute to read`;
}