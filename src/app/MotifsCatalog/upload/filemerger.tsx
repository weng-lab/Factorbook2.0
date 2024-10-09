"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

import { readBed } from "./bedreader";
import { GenomicRange } from "@/app/AnnotationsVariants/types";

export type FileMergerProps = {
  files: FileList | File[];
  onComplete: (regions: GenomicRange[]) => void;
};

function mergeRegions(regions: GenomicRange[]): GenomicRange[] {
  if (regions.length <= 1) return regions;
  regions = regions
    .slice()
    .sort((a: GenomicRange, b: GenomicRange): number =>
      a.chromosome! < b.chromosome!
        ? -1
        : a.chromosome! > b.chromosome!
        ? 1
        : a.start! - b.start!
    );
  const results: GenomicRange[] = [regions[0]];
  for (let i = 1; i < regions.length; ++i) {
    if (
      regions[i].chromosome! === results[results.length - 1].chromosome! &&
      regions[i].start! <= results[results.length - 1].end!
    ) {
      if (regions[i].end! > results[results.length - 1].end!)
        results[results.length - 1].end = regions[i].end;
    } else results.push(regions[i]);
  }
  return results;
}

type FileMergerState = {
  regions: GenomicRange[];
  index: number;
};

export const FileMerger: React.FC<FileMergerProps> = ({
  files,
  onComplete,
}) => {
  const [state, setState] = useState<FileMergerState>({
    regions: [],
    index: 0,
  });

  const nextFile = (newRegions: GenomicRange[]): void => {
    setState((prevState) => ({
      regions: prevState.regions.concat(newRegions),
      index: prevState.index + 1,
    }));
  };

  const mergeFiles = () => {
    if (!files || files.length === 0) return;
    if (state.index === files.length) {
      onComplete(mergeRegions(state.regions));
      setState({ regions: state.regions, index: -1 });
    } else if (state.index > -1) {
      readBed(files[state.index], nextFile, () => nextFile([]));
    }
  };

  useEffect(() => {
    mergeFiles();
  }, [state.index, files]); // Trigger mergeFiles when index or files change

  return files && files.length > 0 ? (
    <Dialog open>
      <DialogTitle>Merging files...</DialogTitle>
      <DialogContent>
        <Typography>
          {files.length - state.index} file(s) remaining...
        </Typography>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default FileMerger;
