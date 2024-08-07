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

export const MOTIF_QUERY = gql`
    query MemeMotifs($peaks_accession: [String]) {
        meme_motifs(peaks_accession: $peaks_accession) {
            consensus_regex
            pwm
            sites
            e_value
            original_peaks_occurrences
            original_peaks
            flank_occurrences_ratio
            flank_z_score
            flank_p_value
            shuffled_occurrences_ratio
            shuffled_z_score
            shuffled_p_value
            peak_centrality
            id
            name
        }
        target_motifs(peaks_accessions: $peaks_accession, e_value_threshold: 1e-2) {
            e_value
            target_id
            sites
            jaspar_name
            motifid
        }
    }
`;