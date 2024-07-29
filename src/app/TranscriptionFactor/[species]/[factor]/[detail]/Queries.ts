import gql from 'graphql-tag';

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

export const DEEP_LEARNED_MOTIF_OCCURRENCES_QUERY = gql`
    query DeepLearnedMotifPeakOccurrences($genomic_region: [GenomicRegionInput!]!, $tf: String) {
        deep_learned_motif_peak_occurrences(genomic_region: $genomic_region, tf: $tf) {
            genomic_region {
                chromosome
                start
                end
            }
            tf
            sequence
            rdhs
            score
            ppm
            name
            strand
            number_of_datasets_instance_found_in
            number_of_celltypes_instance_found_in
            annotation
            class_of_transposable_element
        }
    }
`;

export const DEEP_LEARNED_MOTIFS_SELEX_QUERY = gql`
    query DLMotifsSelex(
        $tf: String
        $assay: String
        $source: String
        $selex_round: [Int]
        $species: String
        $protein_type: String
        $accession: String
    ) {
        deep_learned_motifs(
            tf: $tf
            source: $source
            assay: $assay
            selex_round: $selex_round
            species: $species
            accession: $accession
            protein_type: $protein_type
        ) {
            selex_round
            ppm
            roc_curve
            au_roc
            fractional_enrichment
        }
    }
`;

export const DEEP_LEARNED_MOTIFS_SELEX_METADATA_QUERY = gql`
    query DLMotifsSelexMetadata(
        $tf: String
        $assay: String
        $source: String
        $selex_round: [Int]
        $species: String
        $protein_type: String
        $accession: String
    ) {
        deep_learned_motifs(
            tf: $tf
            source: $source
            assay: $assay
            selex_round: $selex_round
            species: $species
            accession: $accession
            protein_type: $protein_type
        ) {
            selex_round
            source
            tf
            assay
            protein_type
        }
    }
`;

export const DEEP_LEARNED_MOTIFS_NONSELEX_QUERY = gql`
    query DLMotifsNonSelex(
        $tf: String
        $assay: String
        $source: String
        $selex_round: [Int]
        $species: String
        $accession: String
    ) {
        deep_learned_motifs(
            tf: $tf
            source: $source
            assay: $assay
            selex_round: $selex_round
            species: $species
            accession: $accession
        ) {
            tf
            ppm
            total_number_of_datasets_instance_found_in
            total_number_of_celltypes_instance_found_in
            consensus_regex
        }
    }
`;
