import { useMediaQuery } from "@mantine/hooks";

export const useResponsive = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile;
};
