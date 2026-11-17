export function isValid(s: string): boolean {
    if (s.length % 2 !== 0) {
        return false;
    }

    const stack: string[] = [];
    const matching: Record<string, string> = {
        ')': '(',
        ']': '[',
        '}': '{',
    };

    for (const char of s) {
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
        } else if (char in matching) {
            if (stack.length === 0 || stack[stack.length - 1] !== matching[char]) {
                return false;
            }
            stack.pop();
        }
    }

    return stack.length === 0;
}