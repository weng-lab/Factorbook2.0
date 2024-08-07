import gql from 'graphql-tag';

export const DATASETS_QUERY = gql`
    query Datasets(
        $target: String
        $processed_assembly: String
        $replicated_peaks: Boolean
        $include_investigatedas: [String]
        $exclude_investigatedas: [String]
    ) {
        peakDataset(
            target: $target
            processed_assembly: $processed_assembly
            replicated_peaks: $replicated_peaks
            exclude_investigatedas: $exclude_investigatedas
            include_investigatedas: $include_investigatedas
        ) {
            counts {
                total
            }
            datasets {
                lab {
                    friendly_name
                    name
                }
                biosample
                released
                accession
                replicated_peaks: files(types: "replicated_peaks", assembly: $processed_assembly) {
                    accession
                }
                released
            }
            partitionByBiosample {
                biosample {
                    name
                }
                counts {
                    total
                    targets
                }
                datasets {
                    lab {
                        friendly_name
                        name
                    }
                    accession
                    replicated_peaks: files(types: "replicated_peaks", assembly: $processed_assembly) {
                        accession
                    }
                }
            }
        }
    }
`;