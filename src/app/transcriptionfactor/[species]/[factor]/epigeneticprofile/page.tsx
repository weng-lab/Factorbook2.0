import { AGGREGATE_METADATA_QUERY } from "@/components/motifmeme/aggregate/queries";
import { histoneBiosamplePartitions } from "@/components/motifmeme/aggregate/utils";
import { Dataset } from "@/components/types";
import { redirect } from "next/navigation";
import { query } from "../../../../../../lib/client";

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

  let datasets: Dataset[] | null = null;

  try {
    const { data } = await query({
      query: AGGREGATE_METADATA_QUERY,
      variables: { assembly, target: factor },
    });

    datasets = data
      ? histoneBiosamplePartitions(data)
          .list.map((ds: any) =>
            ds.datasets.map((d: any) => ({
              biosample: ds.biosample.name,
              accession: d.accession,
            }))
          )
          .flat()
      : null;
      
  } catch (error) {
    console.error("Error fetching data:", error);
    return <p>Error fetching Histone Modification Data</p>;
  }

  if (datasets && datasets.length > 0) {
    redirect(`/transcriptionfactor/${species}/${factor}/epigeneticprofile/${datasets[0].accession}`);
  } else {
    return <p>No experiments found</p>;
  }
}
