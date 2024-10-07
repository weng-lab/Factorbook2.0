import gql from 'graphql-tag';

export const CELLTYPE_DESCRIPTION_QUERY = gql`
    query CellType($name: [String], $assembly: String!) {
        celltype(name: $name, assembly: $assembly) {
            ct_image_url
            wiki_desc
            celltype
        }
    }
`;


export const DATASET_QUERY = gql`
    query Datasets(
        $biosample: String
        $processed_assembly: String
        $replicated_peaks: Boolean
        $include_investigatedas: [String]
        $exclude_investigatedas: [String]
    ) {
        peakDataset(
            biosample: $biosample
            processed_assembly: $processed_assembly
            replicated_peaks: $replicated_peaks
            exclude_investigatedas: $exclude_investigatedas
            include_investigatedas: $include_investigatedas
        ) {
            counts {
                biosamples
                targets
                total
            }
            datasets {
                lab {
                    friendly_name
                    name
                }
                target
                released
                accession
                replicated_peaks: files(types: "replicated_peaks", assembly: $processed_assembly) {
                    accession
                }
                released
            }
            partitionByTarget {
                target {
                    name
                }
                counts {
                    total
                    biosamples
                }
            }
        }
    }
`;
