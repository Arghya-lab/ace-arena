import { useEffect, useState } from "react";

export default function usePageSize() {
  const [pageHeight, setPageHeight] = useState(
    document.documentElement.scrollHeight
  );
  const [pageWidth, setPageWidth] = useState(
    document.documentElement.scrollWidth
  );

  useEffect(() => {
    const updatePageSize = () => {
      setPageHeight(document.documentElement.scrollHeight);
      setPageWidth(document.documentElement.scrollWidth);
    };

    // Set initial size
    updatePageSize();

    // Update resize
    window.addEventListener("resize", updatePageSize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updatePageSize);
    };
  }, []);

  return { pageWidth, pageHeight };
}
