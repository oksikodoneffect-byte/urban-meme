export function deepClone<T>(obj: T, seen: WeakMap<object, any> = new WeakMap()): T {
    // Примитивы и функции — возвращаем как есть
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // Защита от циклических ссылок
    if (seen.has(obj as object)) {
        return seen.get(obj as object);
    }

    // Date
    if (obj instanceof Date) {
        return new Date(obj.getTime()) as unknown as T;
    }

    // RegExp
    if (obj instanceof RegExp) {
        const clone = new RegExp(obj.source, obj.flags);
        clone.lastIndex = obj.lastIndex;
        return clone as unknown as T;
    }

    // Map
    if (obj instanceof Map) {
        const clone = new Map();
        seen.set(obj as object, clone);
        obj.forEach((value, key) => {
            clone.set(deepClone(key, seen), deepClone(value, seen));
        });
        return clone as unknown as T;
    }

    // Set
    if (obj instanceof Set) {
        const clone = new Set();
        seen.set(obj as object, clone);
        obj.forEach((value) => {
            clone.add(deepClone(value, seen));
        });
        return clone as unknown as T;
    }

    // Массивы
    if (Array.isArray(obj)) {
        const clone: any[] = [];
        seen.set(obj, clone);
        obj.forEach((item, index) => {
            clone[index] = deepClone(item, seen);
        });
        return clone as unknown as T;
    }

    // Обычные объекты — с сохранением прототипа
    const proto = Object.getPrototypeOf(obj);
    const clone = Object.create(proto);
    seen.set(obj as object, clone);

    // Копируем все свойства, включая символы
    Reflect.ownKeys(obj as object).forEach((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(obj as object, key);
        if (descriptor) {
            Object.defineProperty(clone, key, {
                ...descriptor,
                value: deepClone(descriptor.value, seen),
            });
        }
    });

    return clone;
}