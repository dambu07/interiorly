import { Progress } from "@/components/ui/progress";
import { Chip } from "@nextui-org/react";
import {
  IconAccuracy,
  IconCheck,
  IconClose,
  IconEdit,
  IconHelp,
  IconMessage,
  IconSecure,
  IconStop,
  IconUsers,
} from "@/components/icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  cn,
  evaluatePasswordStrength,
  getStrengthIndicator,
} from "@/lib/utils";
import { Button } from "../ui/button";
import { PasswordStrengthEvaluationResult } from "@/types";

export function PasswordStrengthIndicator({
  criteria,
  strengthPercentage,
}: PasswordStrengthEvaluationResult) {
  const strengthIndicator =
    strengthPercentage > 0
      ? getStrengthIndicator(strengthPercentage)
      : { message: "Enter Password", color: "grey" };

  criteria =
    criteria && criteria.length > 0
      ? criteria
      : evaluatePasswordStrength("").criteria;

  return (
    <div>
      <div className="flex flex-col">
        <Progress
          value={strengthPercentage}
          className={"my-3 h-3"}
          fill={`bg-primary`}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {strengthIndicator.message}
          </span>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full p-0 h-6"
              >
                <IconHelp className="text-muted-foreground" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex flex-col space-y-2">
                {criteria &&
                  criteria.map((criterion, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex space-x-3 h-full items-center",
                        criterion.met ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {criterion.met ? (
                        <IconCheck className="h-4 w-4 mr-3" />
                      ) : (
                        <IconClose className="h-4 w-4 mr-3" />
                      )}
                      {criterion.message}
                    </div>
                  ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}
