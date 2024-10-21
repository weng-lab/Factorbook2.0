import { AggregateMetadataQueryResponse, MappedDatasetCollection, TFDataset } from './types';

/**
 * Associates a list of objects to unique keys.
 * @param objects the list of input object to map.
 * @param key function which computes a unique key for a given input object.
 * @param transform optional transform function to perform on each object before it is returned in the output.
 */
export function associateBy<U, V>(
    objects: U[],
    key: (object: U) => string,
    transform: (object: U) => V
): { [key: string]: V } {
    const r: { [key: string]: V } = {};
    objects.forEach((object: U) => {
        r[key(object)] = transform(object);
    });
    return r;
}

/**
 * Groups a list of objects by key.
 * @param objects the list of input object to group.
 * @param key function which computes a key for a given input object.
 * @param transform optional transform function to perform on each object before it is returned in the output.
 */
export function groupBy<U, V>(
    objects: U[],
    key: (object: U) => string,
    transform: (object: U) => V
): { [key: string]: V[] } {
    const r: { [key: string]: V[] } = {};
    objects.forEach((object: U) => {
        const k = key(object);
        if (r[k] === undefined) r[k] = [];
        r[k].push(transform(object));
    });
    return r;
}

function accessionMap(queryResult: AggregateMetadataQueryResponse): { [accession: string]: string } {
    return associateBy<TFDataset, string>(
        queryResult.peakDataset.datasets,
        x => x.accession,
        x => x.biosample
    );
}

export function histoneBiosamplePartitions(queryResult: AggregateMetadataQueryResponse): MappedDatasetCollection {
    const biosamples = accessionMap(queryResult);
    const groups: { [biosample: string]: Set<string> } = {};
    const biosampleMap: { [accession: string]: string } = {};
    const bAccessionMap: { [biosample: string]: string } = {};
    queryResult.histone_aggregate_values.forEach(experiment => {
        const biosample = biosamples[experiment.peaks_dataset_accession];
        if (biosample === undefined) return;
        biosampleMap[experiment.peaks_dataset_accession] = biosample;
        bAccessionMap[biosample] = experiment.peaks_dataset_accession;
        if (groups[biosample] === undefined) groups[biosample] = new Set<string>();
        groups[biosample].add(experiment.peaks_dataset_accession);
    });
    return {
        list: Object.keys(groups)
            .sort()
            .map(key => ({
                biosample: { name: key },
                counts: { total: groups[key].size, targets: groups[key].size },
                datasets: [...groups[key]].map(item => ({
                    lab: { friendly_name: '', name: '' },
                    replicated_peaks: [],
                    accession: item,
                })),
            })),
        biosampleMap,
        accessionMap: bAccessionMap,
    };
}