"use client";

import React, { useState, useEffect } from "react";

const NGROK_BASE_URL = "https://nonsilicious-ulteriorly-tu.ngrok-free.dev";

interface NgrokImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Custom image component that fetches images via JavaScript with the
 * ngrok-skip-browser-warning header to bypass ngrok's interstitial page.
 * Converts the fetched image to a blob URL for display.
 */
const NgrokImage: React.FC<NgrokImageProps> = ({
  src,
  alt,
  className,
  fallback = <span className="text-6xl">🐱</span>,
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setBlobUrl(null);
    setLoading(true);
    setError(false);

    if (!src) {
      setLoading(false);
      return;
    }

    // Build full URL if src is a relative path
    const fullUrl = src.startsWith("http") ? src : `${NGROK_BASE_URL}${src}`;

    const controller = new AbortController();

    const fetchImage = async () => {
      try {
        const response = await fetch(fullUrl, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType?.startsWith("image/")) {
          throw new Error(`Invalid content type: ${contentType}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Ignore abort errors
        }
        console.error("Error fetching image:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchImage();

    // Cleanup: revoke blob URL and abort fetch on unmount or src change
    return () => {
      controller.abort();
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [src]);

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  if (loading) {
    return (
      <div className={className} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="animate-pulse opacity-50">Loading...</span>
      </div>
    );
  }

  if (error || !blobUrl) {
    return <>{fallback}</>;
  }

  return <img src={blobUrl} alt={alt} className={className} />;
};

export default NgrokImage;
