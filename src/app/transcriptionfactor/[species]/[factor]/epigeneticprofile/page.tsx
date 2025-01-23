import { redirect } from "next/navigation";
import { query } from "../../../../../../lib/client";
import { DATASETS_QUERY, EPIGENETIC_PROFILE_ACCESSIONS } from "../[detail]/_ExperimentSelectionPanel/queries";
import { excludeTargetTypes, includeTargetTypes } from "@/consts";

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

/**
 * This file is here to redirect requests to /transcriptionfactor/[species]/[factor]/epigeneticprofile
 * by adding first experiment to url
 */
export default async function Page({
  params: { species, factor },
}: {
  params: { species: string; factor: string };
}) {
  const assembly = species.toLowerCase() === "human" ? "GRCh38" : "mm10";
  let firstExperiment: string | null = null;

  try {
    const allExperimentsData = getExperiments(assembly, factor)
    const validExperimentsData = getValidExps(assembly)

    const [allExperiments, histoneAccessions] = await Promise.all([allExperimentsData, validExperimentsData]);

    firstExperiment = [... allExperiments.data.peakDataset.partitionByBiosample]
      .sort((a, b) => a.biosample.name.localeCompare(b.biosample.name)) //sort alphabetically
      .map(biosample => { //filter out invalid accessions
        return ({
          ...biosample,
          //filter out experiments which are not valid
          datasets: biosample.datasets.filter(dataset =>
            histoneAccessions.data.histone_aggregate_values?.some(x =>
              x.peaks_dataset_accession === dataset.accession)
          )
        })
      })
      [0].datasets[0].accession; //take first experiment
      
  } catch (error) {
    console.error(error);
    return (
      <>
        <p>Error fetching Histone Modification Data</p>
        <script>
          {`console.error(${JSON.stringify(error)})`}
        </script>
      </>

    );
  }

  if (firstExperiment) {
    redirect(`/transcriptionfactor/${species}/${factor}/epigeneticprofile/${firstExperiment}`);
  } else {
    return <p>No experiments found</p>;
  }
}
