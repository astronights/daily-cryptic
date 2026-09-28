// Light scrambling so the answer isn't readable at a glance in the network
// tab. This is not security: anyone determined can decode it.
const KEY = 'cryptle';

const xor = (s: string) =>
    Array.from(s, (c, i) => String.fromCharCode(c.charCodeAt(0) ^ KEY.charCodeAt(i % KEY.length))).join('');

export const encode = (s: string) => btoa(xor(s));
export const decode = (s: string) => xor(atob(s));
