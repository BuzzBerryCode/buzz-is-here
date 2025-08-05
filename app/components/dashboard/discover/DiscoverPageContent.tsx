'use client'

import React from "react";
import { CreatorFilterSection } from "../../sections/CreatorFilterSection/CreatorFilterSection";
import { CreatorListSection } from "../../sections/CreatorListSection/CreatorListSection";
import { MetricsTitleSection } from "../../sections/MetricsTitleSection/MetricsTitleSection";
import { useCreatorData } from "../../../hooks/useCreatorData";

/**
 * DiscoverPageContent - Modular component for the Discover page
 * 
 * This component contains all the Discover page functionality and can be easily
 * integrated into any dashboard layout. It handles its own data fetching and state.
 * 
 * Features:
 * - Creator metrics display
 * - Advanced filtering (location, platform, buzz score, etc.)
 * - Creator cards/list view with pagination
 * - Server-side sorting and filtering
 * - Dark theme compatible
 * 
 * @returns JSX.Element - The complete Discover page content
 */
export function DiscoverPageContent(): JSX.Element {
  const creatorData = useCreatorData();
  
  return (
    <div className="flex flex-col gap-[15px] lg:gap-[20px] xl:gap-[25px] w-full h-full">
      {/* Page Header with Metrics */}
      <MetricsTitleSection creatorData={creatorData} />
      
      {/* Filter Controls */}
      <CreatorFilterSection creatorData={creatorData} />
      
      {/* Creator List/Cards */}
      <CreatorListSection creatorData={creatorData} />
    </div>
  );
}

export default DiscoverPageContent;
