'use client'

import React from "react";
import ExperimentPanelLayout from "../_utility/ExperimentPanelLayout";

/**
 * Provides left side panel for biosample selection
 */
export default function EpigeneticProfileLayout({
  children,
}: {
  children: React.ReactNode,
}) {

  return (
    <ExperimentPanelLayout mode="MotifEnrichment">
      {children}
    </ExperimentPanelLayout>
  )
}