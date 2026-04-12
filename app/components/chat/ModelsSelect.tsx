import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MODELS } from "../../constants";
import type { ModelHashes } from "../../constants";
import { Models } from "../../constants";

const ModelsSelect = ({
  model,
  setModel,
  modelObj,
}: {
  model: ModelHashes;
  setModel: (model: ModelHashes) => void;
  modelObj: Models[number];
}) => {
  return (
    <Select
      name="model"
      onValueChange={(value) => setModel(value as ModelHashes)}
      value={model}
    >
      <SelectTrigger
        className={cn(
          "hover:cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200",
          "max-xs:w-25 text-left",
        )}
      >
        <SelectValue
          placeholder={
            <div className="flex items-center gap-2 min-w-0">
              {modelObj?.icon &&
                React.cloneElement(modelObj.icon, {
                  key: `${modelObj.modelHash}-icon`,
                  className: "shrink-0",
                })}
              <span className="truncate whitespace-nowrap overflow-hidden text-ellipsis">
                {modelObj.label}
              </span>
            </div>
          }
        />
      </SelectTrigger>
      <SelectContent
        onMouseDown={(e) => e.preventDefault()}
        className="-top-10 popper"
      >
        <SelectGroup>
          {/* MAPEO DE MODELOS */}
          {MODELS.map((mdl) => {
            return (
              <SelectItem
                key={`${mdl.modelHash}-${mdl.label}`}
                value={mdl.modelHash}
                className="hover:cursor-pointer"
                description={mdl.description}
              >
                <div className="flex items-center gap-2">
                  {mdl?.icon &&
                    React.cloneElement(mdl.icon, {
                      key: `${mdl.modelHash}-icon`,
                    })}
                  {mdl.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ModelsSelect;
