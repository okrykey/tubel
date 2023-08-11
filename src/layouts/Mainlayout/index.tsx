import React from "react";
import { HeaderTabs } from "~/components/Header";
import PostFormModal from "~/components/PostFormModal";

const MainLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex h-full w-full flex-col">
      <HeaderTabs />
      <PostFormModal />
      {children}
    </div>
  );
};

export default MainLayout;
