/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n    query LDSC($study: [String]){\n      iCRELdrQuery(study: $study) {\n        snps\n      }\n    }": types.LdscDocument,
    "\n  query CellType($name: [String], $assembly: String!) {\n    celltype(name: $name, assembly: $assembly) {\n      ct_image_url\n      wiki_desc\n    }\n  }\n": types.CellTypeDocument,
    "\n    query Dataset_Query(\n        $biosample: String\n        $processed_assembly: String\n        $replicated_peaks: Boolean\n        $include_investigatedas: [String]\n        $exclude_investigatedas: [String]\n    ) {\n        peakDataset(\n            biosample: $biosample\n            processed_assembly: $processed_assembly\n            replicated_peaks: $replicated_peaks\n            exclude_investigatedas: $exclude_investigatedas\n            include_investigatedas: $include_investigatedas\n        ) {\n            counts {\n                biosamples\n                targets\n                total\n            }\n            datasets {\n                lab {\n                    friendly_name\n                    name\n                }\n                target\n                released\n                accession\n                replicated_peaks: files(types: \"replicated_peaks\", assembly: $processed_assembly) {\n                    accession\n                }\n                released\n            }\n            partitionByTarget {\n                target {\n                    name\n                }\n                counts {\n                    total\n                    biosamples\n                }\n            }\n        }\n    }\n": types.Dataset_QueryDocument,
    "\n    query TF_INFO_Query(\n        $processed_assembly: String\n        $replicated_peaks: Boolean\n        $include_investigatedas: [String]\n        $exclude_investigatedas: [String]\n    ) {\n        peakDataset(\n            processed_assembly: $processed_assembly\n            replicated_peaks: $replicated_peaks\n            exclude_investigatedas: $exclude_investigatedas\n            include_investigatedas: $include_investigatedas\n        ) {\n            counts {\n                biosamples\n                targets\n                total\n            }\n            partitionByTarget {\n                target {\n                    name\n                }\n                counts {\n                    total\n                    biosamples\n                }\n            }\n            partitionByBiosample {\n                biosample {\n                    name\n                }\n                counts {\n                    total\n                    targets\n                }\n            }\n        }\n    }\n": types.Tf_Info_QueryDocument,
    "\n  query Experiment($accession: [String]) {\n    peakDataset(accession: $accession) {\n      datasets {\n        lab {\n          friendly_name\n        }\n        released\n        target\n        biosample\n        species\n        files(types: [\"replicated_peaks\"]) {\n          accession\n          ... on ReplicatedPeaks {\n            assembly {\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n": types.ExperimentDocument,
    "\n  query Datasets_Query(\n    $target: String\n    $processed_assembly: String\n    $replicated_peaks: Boolean\n    $include_investigatedas: [String]\n    $exclude_investigatedas: [String]\n  ) {\n    peakDataset(\n      target: $target\n      processed_assembly: $processed_assembly\n      replicated_peaks: $replicated_peaks\n      exclude_investigatedas: $exclude_investigatedas\n      include_investigatedas: $include_investigatedas\n    ) {\n      counts {\n        total\n      }\n      datasets {\n        lab {\n          friendly_name\n          name\n        }\n        biosample\n        released\n        accession\n        replicated_peaks: files(\n          types: \"replicated_peaks\"\n          assembly: $processed_assembly\n        ) {\n          accession\n        }\n        released\n      }\n      partitionByBiosample {\n        biosample {\n          name\n        }\n        counts {\n          total\n          targets\n        }\n        datasets {\n          lab {\n            friendly_name\n            name\n          }\n          accession\n          replicated_peaks: files(\n            types: \"replicated_peaks\"\n            assembly: $processed_assembly\n          ) {\n            accession\n          }\n        }\n      }\n    }\n  }\n": types.Datasets_QueryDocument,
    "\n  query Factor($id: [String], $name: [String], $assembly: String!) {\n    factor(id: $id, name: $name, assembly: $assembly) {\n      name\n      gene_id\n      coordinates {\n        start\n        end\n        chromosome\n      }\n      pdbids\n      modifications {\n        symbol\n        modification {\n          position\n          modification\n          amino_acid_code\n        }\n      }\n      ensemble_data {\n        id\n        biotype\n        description\n        display_name\n        hgnc_synonyms\n        hgnc_primary_id\n        uniprot_synonyms\n        uniprot_primary_id\n        version\n        ccds_id\n      }\n      hgnc_data {\n        hgnc_id\n        symbol\n        name\n        uniprot_ids\n        locus_type\n        locus_group\n        location\n        prev_name\n        gene_group\n        gene_group_id\n        ccds_id\n      }\n      uniprot_data\n      ncbi_data\n      factor_wiki\n    }\n  }\n": types.FactorDocument,
    "\n  query Tf_Info(\n    $processed_assembly: String\n    $replicated_peaks: Boolean\n    $include_investigatedas: [String]\n    $exclude_investigatedas: [String]\n  ) {\n    peakDataset(\n      processed_assembly: $processed_assembly\n      replicated_peaks: $replicated_peaks\n      exclude_investigatedas: $exclude_investigatedas\n      include_investigatedas: $include_investigatedas\n    ) {\n      counts {\n        biosamples\n        targets\n        total\n      }\n      partitionByTarget {\n        target {\n          name\n        }\n        counts {\n          total\n          biosamples\n        }\n      }\n      partitionByBiosample {\n        biosample {\n          name\n        }\n        counts {\n          total\n          targets\n        }\n      }\n    }\n  }\n": types.Tf_InfoDocument,
    "\n  query DLMotifsCounts(\n    $tf: String\n    $assay: String\n    $source: String\n    $selex_round: [Int]\n    $species: String\n    $accession: String\n  ) {\n    deep_learned_motifs_counts(\n      tf: $tf\n      source: $source\n      assay: $assay\n      selex_round: $selex_round\n      species: $species\n      accession: $accession\n    ) {\n      nonselexdlmotifs\n      selexdlmotifs\n    }\n  }\n": types.DlMotifsCountsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query LDSC($study: [String]){\n      iCRELdrQuery(study: $study) {\n        snps\n      }\n    }"): (typeof documents)["\n    query LDSC($study: [String]){\n      iCRELdrQuery(study: $study) {\n        snps\n      }\n    }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query CellType($name: [String], $assembly: String!) {\n    celltype(name: $name, assembly: $assembly) {\n      ct_image_url\n      wiki_desc\n    }\n  }\n"): (typeof documents)["\n  query CellType($name: [String], $assembly: String!) {\n    celltype(name: $name, assembly: $assembly) {\n      ct_image_url\n      wiki_desc\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query Dataset_Query(\n        $biosample: String\n        $processed_assembly: String\n        $replicated_peaks: Boolean\n        $include_investigatedas: [String]\n        $exclude_investigatedas: [String]\n    ) {\n        peakDataset(\n            biosample: $biosample\n            processed_assembly: $processed_assembly\n            replicated_peaks: $replicated_peaks\n            exclude_investigatedas: $exclude_investigatedas\n            include_investigatedas: $include_investigatedas\n        ) {\n            counts {\n                biosamples\n                targets\n                total\n            }\n            datasets {\n                lab {\n                    friendly_name\n                    name\n                }\n                target\n                released\n                accession\n                replicated_peaks: files(types: \"replicated_peaks\", assembly: $processed_assembly) {\n                    accession\n                }\n                released\n            }\n            partitionByTarget {\n                target {\n                    name\n                }\n                counts {\n                    total\n                    biosamples\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query Dataset_Query(\n        $biosample: String\n        $processed_assembly: String\n        $replicated_peaks: Boolean\n        $include_investigatedas: [String]\n        $exclude_investigatedas: [String]\n    ) {\n        peakDataset(\n            biosample: $biosample\n            processed_assembly: $processed_assembly\n            replicated_peaks: $replicated_peaks\n            exclude_investigatedas: $exclude_investigatedas\n            include_investigatedas: $include_investigatedas\n        ) {\n            counts {\n                biosamples\n                targets\n                total\n            }\n            datasets {\n                lab {\n                    friendly_name\n                    name\n                }\n                target\n                released\n                accession\n                replicated_peaks: files(types: \"replicated_peaks\", assembly: $processed_assembly) {\n                    accession\n                }\n                released\n            }\n            partitionByTarget {\n                target {\n                    name\n                }\n                counts {\n                    total\n                    biosamples\n                }\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query TF_INFO_Query(\n        $processed_assembly: String\n        $replicated_peaks: Boolean\n        $include_investigatedas: [String]\n        $exclude_investigatedas: [String]\n    ) {\n        peakDataset(\n            processed_assembly: $processed_assembly\n            replicated_peaks: $replicated_peaks\n            exclude_investigatedas: $exclude_investigatedas\n            include_investigatedas: $include_investigatedas\n        ) {\n            counts {\n                biosamples\n                targets\n                total\n            }\n            partitionByTarget {\n                target {\n                    name\n                }\n                counts {\n                    total\n                    biosamples\n                }\n            }\n            partitionByBiosample {\n                biosample {\n                    name\n                }\n                counts {\n                    total\n                    targets\n                }\n            }\n        }\n    }\n"): (typeof documents)["\n    query TF_INFO_Query(\n        $processed_assembly: String\n        $replicated_peaks: Boolean\n        $include_investigatedas: [String]\n        $exclude_investigatedas: [String]\n    ) {\n        peakDataset(\n            processed_assembly: $processed_assembly\n            replicated_peaks: $replicated_peaks\n            exclude_investigatedas: $exclude_investigatedas\n            include_investigatedas: $include_investigatedas\n        ) {\n            counts {\n                biosamples\n                targets\n                total\n            }\n            partitionByTarget {\n                target {\n                    name\n                }\n                counts {\n                    total\n                    biosamples\n                }\n            }\n            partitionByBiosample {\n                biosample {\n                    name\n                }\n                counts {\n                    total\n                    targets\n                }\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Experiment($accession: [String]) {\n    peakDataset(accession: $accession) {\n      datasets {\n        lab {\n          friendly_name\n        }\n        released\n        target\n        biosample\n        species\n        files(types: [\"replicated_peaks\"]) {\n          accession\n          ... on ReplicatedPeaks {\n            assembly {\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Experiment($accession: [String]) {\n    peakDataset(accession: $accession) {\n      datasets {\n        lab {\n          friendly_name\n        }\n        released\n        target\n        biosample\n        species\n        files(types: [\"replicated_peaks\"]) {\n          accession\n          ... on ReplicatedPeaks {\n            assembly {\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Datasets_Query(\n    $target: String\n    $processed_assembly: String\n    $replicated_peaks: Boolean\n    $include_investigatedas: [String]\n    $exclude_investigatedas: [String]\n  ) {\n    peakDataset(\n      target: $target\n      processed_assembly: $processed_assembly\n      replicated_peaks: $replicated_peaks\n      exclude_investigatedas: $exclude_investigatedas\n      include_investigatedas: $include_investigatedas\n    ) {\n      counts {\n        total\n      }\n      datasets {\n        lab {\n          friendly_name\n          name\n        }\n        biosample\n        released\n        accession\n        replicated_peaks: files(\n          types: \"replicated_peaks\"\n          assembly: $processed_assembly\n        ) {\n          accession\n        }\n        released\n      }\n      partitionByBiosample {\n        biosample {\n          name\n        }\n        counts {\n          total\n          targets\n        }\n        datasets {\n          lab {\n            friendly_name\n            name\n          }\n          accession\n          replicated_peaks: files(\n            types: \"replicated_peaks\"\n            assembly: $processed_assembly\n          ) {\n            accession\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Datasets_Query(\n    $target: String\n    $processed_assembly: String\n    $replicated_peaks: Boolean\n    $include_investigatedas: [String]\n    $exclude_investigatedas: [String]\n  ) {\n    peakDataset(\n      target: $target\n      processed_assembly: $processed_assembly\n      replicated_peaks: $replicated_peaks\n      exclude_investigatedas: $exclude_investigatedas\n      include_investigatedas: $include_investigatedas\n    ) {\n      counts {\n        total\n      }\n      datasets {\n        lab {\n          friendly_name\n          name\n        }\n        biosample\n        released\n        accession\n        replicated_peaks: files(\n          types: \"replicated_peaks\"\n          assembly: $processed_assembly\n        ) {\n          accession\n        }\n        released\n      }\n      partitionByBiosample {\n        biosample {\n          name\n        }\n        counts {\n          total\n          targets\n        }\n        datasets {\n          lab {\n            friendly_name\n            name\n          }\n          accession\n          replicated_peaks: files(\n            types: \"replicated_peaks\"\n            assembly: $processed_assembly\n          ) {\n            accession\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Factor($id: [String], $name: [String], $assembly: String!) {\n    factor(id: $id, name: $name, assembly: $assembly) {\n      name\n      gene_id\n      coordinates {\n        start\n        end\n        chromosome\n      }\n      pdbids\n      modifications {\n        symbol\n        modification {\n          position\n          modification\n          amino_acid_code\n        }\n      }\n      ensemble_data {\n        id\n        biotype\n        description\n        display_name\n        hgnc_synonyms\n        hgnc_primary_id\n        uniprot_synonyms\n        uniprot_primary_id\n        version\n        ccds_id\n      }\n      hgnc_data {\n        hgnc_id\n        symbol\n        name\n        uniprot_ids\n        locus_type\n        locus_group\n        location\n        prev_name\n        gene_group\n        gene_group_id\n        ccds_id\n      }\n      uniprot_data\n      ncbi_data\n      factor_wiki\n    }\n  }\n"): (typeof documents)["\n  query Factor($id: [String], $name: [String], $assembly: String!) {\n    factor(id: $id, name: $name, assembly: $assembly) {\n      name\n      gene_id\n      coordinates {\n        start\n        end\n        chromosome\n      }\n      pdbids\n      modifications {\n        symbol\n        modification {\n          position\n          modification\n          amino_acid_code\n        }\n      }\n      ensemble_data {\n        id\n        biotype\n        description\n        display_name\n        hgnc_synonyms\n        hgnc_primary_id\n        uniprot_synonyms\n        uniprot_primary_id\n        version\n        ccds_id\n      }\n      hgnc_data {\n        hgnc_id\n        symbol\n        name\n        uniprot_ids\n        locus_type\n        locus_group\n        location\n        prev_name\n        gene_group\n        gene_group_id\n        ccds_id\n      }\n      uniprot_data\n      ncbi_data\n      factor_wiki\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Tf_Info(\n    $processed_assembly: String\n    $replicated_peaks: Boolean\n    $include_investigatedas: [String]\n    $exclude_investigatedas: [String]\n  ) {\n    peakDataset(\n      processed_assembly: $processed_assembly\n      replicated_peaks: $replicated_peaks\n      exclude_investigatedas: $exclude_investigatedas\n      include_investigatedas: $include_investigatedas\n    ) {\n      counts {\n        biosamples\n        targets\n        total\n      }\n      partitionByTarget {\n        target {\n          name\n        }\n        counts {\n          total\n          biosamples\n        }\n      }\n      partitionByBiosample {\n        biosample {\n          name\n        }\n        counts {\n          total\n          targets\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Tf_Info(\n    $processed_assembly: String\n    $replicated_peaks: Boolean\n    $include_investigatedas: [String]\n    $exclude_investigatedas: [String]\n  ) {\n    peakDataset(\n      processed_assembly: $processed_assembly\n      replicated_peaks: $replicated_peaks\n      exclude_investigatedas: $exclude_investigatedas\n      include_investigatedas: $include_investigatedas\n    ) {\n      counts {\n        biosamples\n        targets\n        total\n      }\n      partitionByTarget {\n        target {\n          name\n        }\n        counts {\n          total\n          biosamples\n        }\n      }\n      partitionByBiosample {\n        biosample {\n          name\n        }\n        counts {\n          total\n          targets\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query DLMotifsCounts(\n    $tf: String\n    $assay: String\n    $source: String\n    $selex_round: [Int]\n    $species: String\n    $accession: String\n  ) {\n    deep_learned_motifs_counts(\n      tf: $tf\n      source: $source\n      assay: $assay\n      selex_round: $selex_round\n      species: $species\n      accession: $accession\n    ) {\n      nonselexdlmotifs\n      selexdlmotifs\n    }\n  }\n"): (typeof documents)["\n  query DLMotifsCounts(\n    $tf: String\n    $assay: String\n    $source: String\n    $selex_round: [Int]\n    $species: String\n    $accession: String\n  ) {\n    deep_learned_motifs_counts(\n      tf: $tf\n      source: $source\n      assay: $assay\n      selex_round: $selex_round\n      species: $species\n      accession: $accession\n    ) {\n      nonselexdlmotifs\n      selexdlmotifs\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;