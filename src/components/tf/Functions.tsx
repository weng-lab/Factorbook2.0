export const getRCSBImageUrl = (
  pdbids: string | null | undefined
): string | undefined => {
  if (!pdbids) return undefined;
  const PBID = pdbids.split(",")[0].split(":")[0].toLowerCase();
  return PBID
    ? `http://cdn.rcsb.org/images/structures/${PBID.substring(
        1,
        3
      )}/${PBID}/${PBID}_chain-A.jpeg`
    : undefined;
};
