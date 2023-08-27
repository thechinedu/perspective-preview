"use client";

import { NextIcon, PreviousIcon } from "@/app/components/Icons";
import { useFunnelData } from "@/app/providers/FunnelDataProvider";
import { ChangeEvent, MouseEvent, useState } from "react";

import { Blocks } from "./blocks";

const MIN_PREVIEW_WINDOW_WIDTH = 375;
const MIN_PREVIEW_WINDOW_HEIGHT = 600;

const MAX_PREVIEW_WINDOW_WIDTH = 640;
const MAX_PREVIEW_WINDOW_HEIGHT = 926;

enum VIEWPORT_PRESETS {
  responsive = "responsive",
  galaxyS20Plus = "galaxy-s20+",
  galaxyFold = "galaxy-fold",
  pixel5 = "pixel-5",
  iphone12 = "iphone-12",
  iphone11 = "iphone-11",
}

const VIEWPORT_PRESETS_MAP = {
  [VIEWPORT_PRESETS.responsive]: {
    width: MIN_PREVIEW_WINDOW_WIDTH,
    height: MIN_PREVIEW_WINDOW_HEIGHT,
  },
  [VIEWPORT_PRESETS.galaxyS20Plus]: {
    width: 384,
    height: 854,
  },
  [VIEWPORT_PRESETS.galaxyFold]: {
    width: 280,
    height: 653,
  },
  [VIEWPORT_PRESETS.pixel5]: {
    width: 393,
    height: 851,
  },
  [VIEWPORT_PRESETS.iphone12]: {
    width: 390,
    height: 844,
  },
  [VIEWPORT_PRESETS.iphone11]: {
    width: 375,
    height: 812,
  },
};

export const Preview = () => {
  const { funnelData } = useFunnelData();
  const [page, setPage] = useState(0);
  const [previewDimensions, setPreviewDimensions] = useState(
    VIEWPORT_PRESETS_MAP.responsive
  );
  const [isResponsiveViewport, setIsResponsiveViewport] = useState(true);

  const { width, height } = previewDimensions;
  const totalPages = funnelData?.pages.length;

  const isPreviousDisabled = page === 0;
  const isNextDisabled = page === (totalPages as number) - 1;

  const pageData = funnelData?.pages[page];
  const blocks = pageData?.blocks;

  const handlePageTransition = (direction: "previous" | "next") => () => {
    if (direction === "previous") {
      setPage(page - 1);
    } else {
      setPage(page + 1);
    }
  };

  const handlePreviewDimensionChange =
    (dimension: "width" | "height") => (evt: ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(evt.target.value);

      if (
        dimension === "width" &&
        (value < MIN_PREVIEW_WINDOW_WIDTH || value > MAX_PREVIEW_WINDOW_WIDTH)
      ) {
        return;
      }

      if (
        dimension === "height" &&
        (value < MIN_PREVIEW_WINDOW_HEIGHT || value > MAX_PREVIEW_WINDOW_HEIGHT)
      ) {
        return;
      }

      setPreviewDimensions({
        ...previewDimensions,
        [dimension]: value,
      });
    };

  const handlePresetSelect = (evt: ChangeEvent<HTMLSelectElement>) => {
    const value = evt.target.value as keyof typeof VIEWPORT_PRESETS_MAP;
    const preset = VIEWPORT_PRESETS_MAP[value];
    setPreviewDimensions(preset);
    setIsResponsiveViewport(value === VIEWPORT_PRESETS.responsive);
  };

  const handleMouseUp = (evt: MouseEvent<HTMLDivElement>) => {
    const element = evt.currentTarget as HTMLDivElement;

    const { width, height } = element.getBoundingClientRect();

    setPreviewDimensions({
      width,
      height,
    });
  };

  return (
    <div className="preview-canvas px-2 h-full flex flex-col items-center">
      {funnelData && (
        <div className="preview-actions flex justify-center gap-2 p-4 mb-4 border border-solid w-screen">
          <button
            className={`inline-flex items-center py-2 px-4 rounded-sm text-white ${
              isPreviousDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-800"
            }`}
            onClick={handlePageTransition("previous")}
            disabled={isPreviousDisabled}
          >
            <PreviousIcon className="w-6 h-6 inline align-middle mr-1" />{" "}
            Previous Page
          </button>
          <div className="hidden md:flex items-center justify-between gap-2">
            <label>Dimensions:</label>
            <select
              className="border border-solid border-gray-400 rounded-md px-2 p-1"
              onChange={handlePresetSelect}
            >
              <option value="responsive">Responsive</option>
              <option value="galaxy-s20+">Galaxy S20+</option>
              <option value="galaxy-fold">Galaxy Fold</option>
              <option value="pixel-5">Pixel 5</option>
              <option value="iphone-12">Iphone 12 Pro</option>
              <option value="iphone-11">Iphone 11 Pro</option>
            </select>
            <input
              type="number"
              className="border border-solid border-gray-400 rounded-md px-2 p-1"
              value={width}
              onChange={handlePreviewDimensionChange("width")}
              min={MIN_PREVIEW_WINDOW_WIDTH}
              max={MAX_PREVIEW_WINDOW_WIDTH}
              title="width"
              disabled={!isResponsiveViewport}
            />{" "}
            x{" "}
            <input
              type="number"
              className="border border-solid border-gray-400 rounded-md p-1"
              value={height}
              onChange={handlePreviewDimensionChange("height")}
              min={MIN_PREVIEW_WINDOW_HEIGHT}
              max={MAX_PREVIEW_WINDOW_HEIGHT}
              title="height"
              disabled={!isResponsiveViewport}
            />
          </div>
          <button
            className={`inline-flex items-center py-2 px-4 rounded-sm text-white ${
              isNextDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-gray-800"
            }`}
            onClick={handlePageTransition("next")}
            disabled={isNextDisabled}
          >
            Next Page <NextIcon className="w-6 h-6 inline align-middle ml-1" />
          </button>
        </div>
      )}

      <div
        data-testid="preview-container"
        className={`preview-container ${
          funnelData ? "mx-auto" : "m-auto"
        } w-3/4 rounded-2xl p-4 overflow-auto max-w-full`}
        style={{
          backgroundColor: funnelData?.bgColor,
          width,
          height,
        }}
        onMouseUp={handleMouseUp}
      >
        {!funnelData && (
          <p className="p-4">
            Nothing to preview. Please upload your funnel data first
          </p>
        )}
        {blocks?.map((block) => Blocks[block.type](block))}
      </div>
    </div>
  );
};
