import React from "react";
import TrashRestore from "@/components/trash/restore";
import CustomDialogTrigger from "@/components/custom-dialog-trigger";

interface TrashProps {
  children: React.ReactNode;
}

const Trash: React.FC<TrashProps> = ({ children }) => {
  return (
    <CustomDialogTrigger header="Trash" content={<TrashRestore />}>
      {children}
    </CustomDialogTrigger>
  );
};

export default Trash;
