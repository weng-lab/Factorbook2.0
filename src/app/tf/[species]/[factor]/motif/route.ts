import { redirect } from "next/navigation";
import { query } from "../../../../../../lib/client";
import { DATASETS_QUERY } from "../_utility/ExperimentSelectionPanel/queries";
import { excludeTargetTypes, includeTargetTypes } from "@/consts";

/**
 * This file is here to redirect requests to /tf/[species]/[factor]/motif
 * by adding first experiment to url. Currently this route handler is not
 * used unless the route is manually hit.
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

type Params = {
  species: string;
  factor: string;
}

export async function GET(request: Request, context: { params: Params }) {
  const assembly = context.params.species.toLowerCase() === "human" ? "GRCh38" : "mm10";
  const species = context.params.species;
  const factor = context.params.factor;

  let firstExperiment: string | null = null;

  try {
    const allExperiments = await getExperiments(assembly, factor)

    firstExperiment = [... allExperiments.data.peakDataset.partitionByBiosample]
      .sort((a, b) => a.biosample.name.localeCompare(b.biosample.name)) //sort alphabetically
      [0].datasets[0].accession; //take first experiment
      
  } catch (error) {
    console.error(error);
    return new Response("No experiments found", { status: 404 });
  }

  if (firstExperiment) {
    redirect(`/tf/${species}/${factor}/motif/${firstExperiment}`);
  } else {
    return new Response("No experiments found", { status: 404 });
  }
}
