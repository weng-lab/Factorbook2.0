import { useQuery } from '@apollo/client';
import { PEAKS_ACCESSION_QUERY } from './Queries';
import { ApiContext } from '@/ApiContext';
import { useContext } from 'react';

export interface PeaksAccessionQueryResponse {
  peaksAccession: {
    peaks_accession: string[];
  };
}

export function usePeaksAccession(factor: string, assembly: string) {
  const client = useContext(ApiContext)?.client;
  if (!client) {
    throw new Error('ApiContext client is undefined');
  }
  return useQuery<PeaksAccessionQueryResponse>(PEAKS_ACCESSION_QUERY, {
    client,
    variables: { factor, assembly },
  });
}
