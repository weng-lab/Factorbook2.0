// This is here to support legacy urls coming from encode. Fetches experiment target and redirects to tf portal

import { gql } from "@/types/gql";
import { query } from "../../../../lib/client";
import { redirect } from "next/navigation";

const TARGET_QUERY = gql(`
  query Target_Query($accession: [String]) {
    peakDataset(accession: $accession) {
      datasets {    
        target
        species
      }
    }
  }
`)

async function getTarget(accession: string) {
  return await query({
    query: TARGET_QUERY,
    variables: {
      accession
    }
  })
}

export async function GET(request: Request, { params: { accession } }: { params: { accession: string[] } }) {
  /**
   * params will be array of strings, since [...accession] is a catch-all segment, which catches:
   * 
   * experiment/{accession} <-- linked to by ENCODE
   * experiment/{accession}/motif <-- old factorbook redirect to this route from above link
   * experiment/{accession}/{whatever}
   * 
   * experiment accession should be first in this array
   */
  const experiment = accession[0]
  let species: "human" | "mouse";
  let target: string;

  try {
    const res = await getTarget(experiment)

    if (res.error) {
      throw new Error(JSON.stringify(res.error))
    }
    if (res.data.peakDataset.datasets.length === 0) {
      throw new Error("No matching target found for experiment")
    }

    species = res.data.peakDataset.datasets[0].species === "Homo sapiens" ? "human" : "mouse"
    target = res.data.peakDataset.datasets[0].target ?? ""

    if (!species || !target){
      throw new Error("Species or target not found")
    }

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return new Response(error.message, { status: 404 });
    } else {
      console.error("An unknown error occurred", error);
      return new Response("Target of experiment not found", { status: 404 });
    }
  }

  redirect(`/tf/${species}/${target}/motif/${experiment}`)
}