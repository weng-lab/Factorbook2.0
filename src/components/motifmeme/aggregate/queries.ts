import gql from 'graphql-tag';

/**
 * @todo this is used in 3 places, need to remove from all and delete this once fixed:
 * 3) [factor]/histone/[accession]/page.tsx only used for matching experiment to biosample. Info should be available in HISTONE_METADATA_QUERY
 */
export const AGGREGATE_METADATA_QUERY = gql`
    query dnasemetadataquery($assembly: String!, $target: String!) {
        histone_aggregate_values(assembly: $assembly) {
            peaks_dataset_accession
        }
        peakDataset(processed_assembly: $assembly, target: $target) {
            datasets {
                accession
                biosample
            }
        }
    }
`;

export const AGGREGATE_DATA_QUERY = gql`
    query aggregate($accession: String!) {
        histone_aggregate_values(peaks_dataset_accession: $accession) {
            histone_dataset_accession
            distal_values
            proximal_values
        }
    }
`;

export const HISTONE_METADATA_QUERY = gql`
    query metadata($accessions: [String!]) {
        peakDataset(accession: $accessions) {
            datasets {
                accession
                target
            }
        }
    }
`;

export const FOOTPRINT_AGGREGATE_QUERY = gql`
    query atacagg($peaks_accession: [String!], $motif: String) {
        atac_aggregate(peaks_accession: $peaks_accession, motif: $motif) {
            forward_values
            reverse_values
        }
        dnase_aggregate(peaks_accession: $peaks_accession, motif: $motif) {
            forward_values
            reverse_values
        }
    }
`;

export const CONSERVATION_AGGREGATE_QUERY = gql`
    query conservationagg($peaks_accession: [String!], $motif: String) {
        conservation_aggregate(peaks_accession: $peaks_accession, motif: $motif) {
            values
            conservation_type
        }
    }
`;