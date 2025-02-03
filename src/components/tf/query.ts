import { gql } from "@apollo/client";

export const EXPERIMENT_QUERY = gql`
    query Experiment2($accession: [String]) {
        peakDataset(accession: $accession) {
            datasets {
                lab {
                    friendly_name
                }
                released
                target
                biosample
                species
                files(types: ["replicated_peaks"]) {
                    accession
                    ... on ReplicatedPeaks {
                        assembly {
                            name
                        }
                    }
                }
            }
        }
    }
`;

export const DATASETS_QUERY = gql`
    query DatasetsQuery(
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

export const FACTOR_DESCRIPTION_QUERY = gql`
    query Factor($id: [String], $name: [String], $assembly: String!) {
        factor(id: $id, name: $name, assembly: $assembly) {
            name
            gene_id
            coordinates {
                start
                end
                chromosome
            }
            pdbids
            modifications {
                symbol
                modification {
                    position
                    modification
                    amino_acid_code
                }
            }
            ensemble_data {
                id
                biotype
                description
                display_name
                hgnc_synonyms
                hgnc_primary_id
                uniprot_synonyms
                uniprot_primary_id
                version
                ccds_id
            }
            hgnc_data {
                hgnc_id
                symbol
                name
                uniprot_ids
                locus_type
                locus_group
                location
                prev_name
                gene_group
                gene_group_id
                ccds_id
            }
            uniprot_data
            ncbi_data
            factor_wiki
        }
    }
`;

export const TF_INFO_QUERY = gql`
    query Datasets3(
        $processed_assembly: String
        $replicated_peaks: Boolean
        $biosample: String
        $include_investigatedas: [String]
        $exclude_investigatedas: [String]
    ) {
        peakDataset(
            processed_assembly: $processed_assembly
            replicated_peaks: $replicated_peaks
            biosample: $biosample
            exclude_investigatedas: $exclude_investigatedas
            include_investigatedas: $include_investigatedas
        ) {
            counts {
                biosamples
                targets
                total
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
            partitionByBiosample {
                biosample {
                    name
                }
                counts {
                    total
                    targets
                }
            }
        }
    }
`;

export const DEEP_LEARNED_MOTIFS_COUNTS_QUERY = gql`
    query DLMotifsCounts(
        $tf: String
        $assay: String
        $source: String
        $selex_round: [Int]
        $species: String
        $accession: String
    ) {
        deep_learned_motifs_counts(
            tf: $tf
            source: $source
            assay: $assay
            selex_round: $selex_round
            species: $species
            accession: $accession
        ) {
            nonselexdlmotifs
            selexdlmotifs
        }
    }
`;
