import React from "react";
import { HeaderTabs } from "~/components/Header";

const MainLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex h-full w-full flex-col">
      <HeaderTabs />
      {children}
    </div>
  );
};

export default MainLayout;
