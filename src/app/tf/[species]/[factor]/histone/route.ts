import { redirect } from "next/navigation";
import { query } from "../../../../../../lib/client";
import { DATASETS_QUERY, EPIGENETIC_PROFILE_ACCESSIONS } from "../_utility/ExperimentSelectionPanel/queries";
import { excludeTargetTypes, includeTargetTypes } from "@/consts";

/**
 * This file is here to redirect requests to /tf/[species]/[factor]/histone
 * by adding first experiment to url. Currently this route handler is not used unless the
 * route is manually hit.
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

async function getValidExps(assembly: "GRCh38" | "mm10") {
  return await query({
    query: EPIGENETIC_PROFILE_ACCESSIONS,
    variables: {
      assembly: assembly,
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
    const allExperimentsData = getExperiments(assembly, factor)
    const validExperimentsData = getValidExps(assembly)

    const [allExperiments, histoneAccessions] = await Promise.all([allExperimentsData, validExperimentsData]);

    firstExperiment = [... allExperiments.data.peakDataset.partitionByBiosample]
      .sort((a, b) => a.biosample.name.localeCompare(b.biosample.name)) //sort alphabetically
      .map(biosample => {
        return ({
          ...biosample,
          //filter out experiments which are not valid
          datasets: biosample.datasets.filter(dataset =>
            histoneAccessions.data.histone_aggregate_values?.some(x =>
              x.peaks_dataset_accession === dataset.accession)
          )
        })
      })
      .filter(biosample => biosample.datasets.length > 0) //filter out biosamples with no valid experiments
      [0].datasets[0].accession; //take first experiment
      
  } catch (error) {
    console.error(error);
    return new Response("No experiments found", { status: 404 });
  }

  if (firstExperiment) {
    redirect(`/tf/${species}/${factor}/histone/${firstExperiment}`);
  } else {
    return new Response("No experiments found", { status: 404 });
  }
}
