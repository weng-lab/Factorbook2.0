import { Result } from './types';

/**
 * Filters for unique search results, as non-unique results cause undefined
 * behavior in the semantic UI search component.
 *
 * @param results the list of results, each with a title field which distinguishes unique results.
 */
export const uniq = (results: Result[], d: string): Result[] => {
    let r: Result[] = [];
    results.forEach((result: Result) => {
        let found = false;
        r.forEach(rr => {
            if (rr.title === result.title) found = true;
        });
        if (!found) r.push(result);
    });

    return r.length ? r : [{ title: d, description: '' }];
};

/**
 * Checks whether the entire string is a genomic coordinate in the form
 * chromosome:start-end.
 *
 * @param value the value to check
 */
export const isCoordinate = (value: string) => {
    if (value === undefined) {
        return;
    }
    const match = value.match && value.match(/^[a-zA-Z0-9]+[:][0-9,]+[-][0-9,]+$/g);
    return match && match.length && match.length === 1;
};