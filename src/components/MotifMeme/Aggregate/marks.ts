export const MARK_GROUPS: { [title: string]: string[] } = {
    'Activating histone marks': ['H3K4me3', 'H3K27ac', 'H3K4me1', 'H3K9ac', 'H3K4me2'],
    'Repressive histone marks': ['H3K27me3', 'H3K9me3'],
    'Transcriptional histone marks': ['H3K79me2', 'H3K36me3'],
    'Other histone marks': ['H4K20me1', 'H2AFZ'],
  };
  
  export const MARK_COLORS: { [mark: string]: string } = {
    H3K4me3: '#ff0000',
    H3K27ac: '#ffcd00',
    H3K4me1: '#ffdf00',
    H3K4me2: '#ddaa80',
    H3K9ac: '#ff7903',
    H3K27me3: '#aeafae',
    H3K36me3: '#008000',
    H3K9me3: '#b4dde4',
    H3K79me2: '#00a000',
    H4K20me1: '#880088',
    H2AFZ: '#aa7700',
    ATAC: '#008800',
    MNase: '#888800',
  };
  
  export const MARK_TYPES = ((): { [key: string]: string } => {
    const r: { [key: string]: string } = {};
    Object.keys(MARK_GROUPS).forEach(k => {
      MARK_GROUPS[k].forEach(v => {
        r[v] = k;
      });
    });
    return r;
  })();
  
  export const MARK_TYPE_ORDER = [
    'Activating histone marks',
    'Repressive histone marks',
    'Transcriptional histone marks',
    'Other histone marks',
  ];
  