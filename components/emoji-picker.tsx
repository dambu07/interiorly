"use client";

import React from "react";
import data, { Category } from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";

interface EmojiPickerProps {
  children: React.ReactNode;
  getValue?: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ children, getValue }) => {
  const { theme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger className="relative flex items-center justify-center w-16 h-16 rounded-full cursor-pointer">
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="p-0
          m-auto flex items-center justify-center border border-red-400
        "
      >
        <Picker
          autpFocus
          locale="en"
          className="bg-red-500"
          cateogries={[
            "people",
            "nature",
            "activity",
            "places",
            "objects",
            "symbols",
          ]}
          data={data}
          theme={theme || "light"}
          onEmojiSelect={(emoji: any) => {
            console.log(emoji);
            if (getValue) getValue(emoji.native);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
