'use client'

import PeakSearch from "./peaksearch";

export default function RegionsPage({
  params: { species, factor },
}: {
  params: { species: string; factor: string };
}) {
  return (
    /**
     * @todo probably transition this component to using props for species/factor 
     * instead of it using useParams
     */
    (<PeakSearch />)
  );
}