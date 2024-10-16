import gql from 'graphql-tag';

export const PEAK_QUERY = gql`
    query peaksrange(
        $experiment_accession: String
        $file_accession: String
        $target: String
        $biosample: String
        $range: [ChromosomeRangeInput]!
        $assembly: String!
        $limit: Int
        $offset: Int
        $orderby: Boolean
    ) {
        peaksrange(
            experiment_accession: $experiment_accession
            target: $target
            biosample: $biosample
            file_accession: $file_accession
            range: $range
            assembly: $assembly
            limit: $limit
            offset: $offset
            orderby: $orderby
        ) {
            data
            error {
                message
                errortype
            }
        }
    }
`;


export const MOTIFS_QUERY = gql`
    query motifsInPeak($genomic_region: [GenomicRegionInput!]!) {
        meme_occurrences(genomic_region: $genomic_region) {
            peaks_accession
            consensus_regex
            q_value
            genomic_region {
                chromosome
                start
                end
            }
            motif {
                id
                pwm
                flank_z_score
                flank_p_value
                shuffled_z_score
                shuffled_p_value
            }
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

export const TOMTOM_MATCH_QUERY = gql`
    query tomtomMatches($peaks_accessions: [String!]!, $ids: [String!]!) {
        target_motifs(peaks_accessions: $peaks_accessions, motif_id: $ids) {
            target_id
            e_value
            jaspar_name
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
