export const italicizeRegex = (text: string, regex: string): string => {
    const re = new RegExp(regex, 'g');
    return text.replace(re, '**$&**');
}