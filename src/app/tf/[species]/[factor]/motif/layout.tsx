'use client'

import React from "react";
import ExperimentSelectionLayout from "../_utility/experimentSelectionLayout";

/**
 * Provides left side panel for biosample selection
 */
export default function EpigeneticProfileLayout({
  children,
}: {
  children: React.ReactNode,
}) {

  return (
    <ExperimentSelectionLayout mode="MotifEnrichment">
      {children}
    </ExperimentSelectionLayout>
  )
}