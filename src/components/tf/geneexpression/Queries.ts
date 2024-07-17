import gql from 'graphql-tag';

export const GENE_EXPRESSION_QUERY = gql`
    query geneexpression($assembly: String!, $gene_id: [String], $assay_term_name: [String]) {
        gene_dataset(assay_term_name: $assay_term_name) {
            biosample
            tissue
            biosample_type
            accession
            gene_quantification_files(assembly: $assembly) {
                accession
                quantifications(gene_id_prefix: $gene_id) {
                    tpm
                }
            }
        }
    }
`;

export const GENE_ID_QUERY = gql`
    query geneid($assembly: String!, $gene_name: [String]) {
        gene(assembly: $assembly, name: $gene_name) {
            id
        }
    }
`;
