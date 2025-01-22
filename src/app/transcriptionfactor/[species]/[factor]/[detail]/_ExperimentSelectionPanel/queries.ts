import { gql } from "@/types/gql";

export const DATASETS_QUERY = gql(`
    query experiment_accessions(
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
                    }
                    biosample
                    accession
                    replicated_peaks: files(types: "replicated_peaks", assembly: $processed_assembly) {
                        accession
                    }
                }
            }
        }
    }
`)

export const EPIGENETIC_PROFILE_ACCESSIONS = gql(`
    query epigenetic_accessions($assembly: String!, $target: String!) {
        histone_aggregate_values(assembly: $assembly) {
            peaks_dataset_accession
        }
    }
`)