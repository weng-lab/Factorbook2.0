import { gql } from '@apollo/client';

export const MINOR_ALLELE_FREQUENCY = gql`
    query maf($positions: [PositionInput!]!) {
        maf(positions: $positions) {
            snp
            refAllele
            minorAlleles {
                sequence
                afr_af
                amr_af
                eas_af
                eur_af
                sas_af
                frequency
            }
            position {
                chromosome
                position
            }
        }
    }
`;

export const SNP_QUERY = gql`
    query snp(
        $snpids: [String]
        $assembly: String!
        $population: Population!
        $subpopulation: SubPopulation
        $rSquaredThreshold: Float
    ) {
        snpQuery(snpids: $snpids, assembly: $assembly) {
            refAllele
            refFrequency
            id
            minorAlleleFrequency {
                sequence
                afr_af
                amr_af
                eas_af
                eur_af
                sas_af
            }
            coordinates {
                chromosome
                start
                end
            }
            linkageDisequilibrium(
                population: $population
                subpopulation: $subpopulation
                rSquaredThreshold: $rSquaredThreshold
            ) {
                rSquared
                snp(assembly: $assembly) {
                    refAllele
                    refFrequency
                    id
                    minorAlleleFrequency {
                        sequence
                        afr_af
                        amr_af
                        eas_af
                        eur_af
                        sas_af
                    }
                    coordinates {
                        chromosome
                        start
                        end
                    }
                }
            }
        }
    }
`;

export const SNP_AUTOCOMPLETE_QUERY = `
    query suggestions($assembly: String!, $snpid: String!) {
        snpAutocompleteQuery(assembly: $assembly, snpid: $snpid) {
            id
            coordinates {
                chromosome
                start
                end
            }
        }
    }
`;

export const PEAK_QUERY = gql`
    query peaks($assembly: String!, $range: [ChromosomeRangeInput]!) {
        peaks(assembly: $assembly, range: $range) {
            peaks {
                q_value
                experiment_accession
                file_accession
                dataset {
                    target
                    biosample
                }
                chrom
                chrom_start
                chrom_end
            }
        }
    }
`;

export const MOTIF_QUERY = gql`
    query occurrences1($range: [GenomicRegionInput!]) {
        meme_occurrences(genomic_region: $range) {
            motif {
                pwm
                peaks_file {
                    assembly
                    accession
                    dataset_accession
                }
                tomtom_matches {
                    jaspar_name
                    target_id
                    e_value
                }
                flank_p_value
                shuffled_p_value
            }
            strand
            q_value
            genomic_region {
                chromosome
                start
                end
            }
        }
    }
`;

export const RDHS_OCCU_QUERY = gql`
    query occurrences2($range: [GenomicRegionInput!]!) {
        rdhs_motif_occurrences(genomic_region: $range) {
            motif {
                pwm
                peaks_file {
                    assembly
                    accession
                    dataset_accession
                }
                tomtom_matches {
                    jaspar_name
                    target_id
                    e_value
                }
                flank_p_value
                shuffled_p_value
            }
            rdhs
            strand
            p_value
            genomic_region {
                chromosome
                start
                end
            }
        }
    }
`;