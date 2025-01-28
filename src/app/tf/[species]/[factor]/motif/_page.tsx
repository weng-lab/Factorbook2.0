import { redirect } from "next/navigation";
import { query } from "../../../../../../lib/client";
import { DATASETS_QUERY } from "../_ExperimentSelectionPanel/queries";
import { excludeTargetTypes, includeTargetTypes } from "@/consts";

/**
 * This file is here to redirect requests to /tf/[species]/[factor]/motif
 * by adding first experiment to url
 */

async function getExperiments(processed_assembly: "GRCh38" | "mm10", target: string) {
  return await query({
    query: DATASETS_QUERY,
    variables: {
      processed_assembly,
      target,
      replicated_peaks: true,
      include_investigatedas: includeTargetTypes,
      exclude_investigatedas: excludeTargetTypes,
    }
  })
}

export default async function Page({
  params: { species, factor },
}: {
  params: { species: string; factor: string };
}) {
  const assembly = species.toLowerCase() === "human" ? "GRCh38" : "mm10";
  let firstExperiment: string | null = null;

  try {
    const allExperiments = await getExperiments(assembly, factor)

    firstExperiment = [... allExperiments.data.peakDataset.partitionByBiosample]
      .sort((a, b) => a.biosample.name.localeCompare(b.biosample.name)) //sort alphabetically
      [0].datasets[0].accession; //take first experiment
      
  } catch (error) {
    console.error(error);
    return (
      <>
        <p>Error fetching Motif Enrichment Experiments</p>
        <script>
          {`console.error(${JSON.stringify(error)})`}
        </script>
      </>

    );
  }

  if (firstExperiment) {
    redirect(`/tf/${species}/${factor}/motif/${firstExperiment}`);
  } else {
    return <p>No experiments found</p>;
  }
}
