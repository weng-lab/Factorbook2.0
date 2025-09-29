import { useEffect, useState } from "react";

interface useGetPdbIdResult {
    tfName: string;
    uniprotId: string | undefined;
    pdbIds: string[];
    loading: boolean;
    error: string | null;
}

export function useGetPdbId(tfName: string, assembly: string, uniprotOverride?: string): useGetPdbIdResult {
    
    const [uniprotId, setUniprotId] = useState<string | undefined>(uniprotOverride || undefined);
    const [pdbIds, setPdbIds] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchUniProtId(tf: string): Promise<string | null> {
        const organism_id = assembly==="GRCh38" ? 9606 : 10090
        
        const url = `https://rest.uniprot.org/uniprotkb/search?query=gene:${tf}+AND+organism_id:${organism_id}&fields=accession&format=json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`UniProt query failed for ${tf}`);
        }

        const data = await response.json();
        return data.results?.[0]?.primaryAccession || null;
    }

    
    async function fetchPdbIds(uniprot: string): Promise<string[]> {
        
        const query = {
            query: {
                type: "terminal",
                service: "text",
                parameters: {
                    attribute:
                        "rcsb_polymer_entity_container_identifiers.reference_sequence_identifiers.database_accession",
                    operator: "exact_match",
                    value: uniprot,
                },
            },
            return_type: "entry",
            request_options: {
                paginate: { start: 0, rows: 100 },
                results_content_type: ["experimental"],
            },
        };


        const response = await fetch("https://search.rcsb.org/rcsbsearch/v2/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(query),
        });

        if (!response.ok) {
            throw new Error(`RCSB query failed for ${uniprot}`);
        }
        
        const data = await response.json();
        return (data.result_set || []).map((r: { identifier: string }) => r.identifier);        
    }

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                    setLoading(true);
                    setError(null);
                    let id = uniprotOverride || null;
                    if (!id) {
                        id = await fetchUniProtId(tfName);
                        if (!id) {
                            throw new Error(`UniProt ID not found for ${tfName}`);
                        }
                    }

                if (cancelled) return;
                setUniprotId(id);


                if (id) {
                    const pdbs = await fetchPdbIds(id);
                    if (cancelled) return;
                    setPdbIds(pdbs);
                }
                
            } catch (err: any) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        load(); 
        return () => {
            cancelled = true;
    };
    }, [tfName, uniprotOverride]);
    return { tfName, uniprotId, pdbIds, loading, error };
}
